-- Test à deux comptes (plus un compte masqué et un visiteur) des règles d'accès, ticket #63.
-- ⚠ À LANCER SEULEMENT SUR UNE BASE DE TEST VIDE, JAMAIS SUR LA PRODUCTION : le script crée des
-- données de test (puis annule tout avec `rollback`).
-- Prérequis : la base de test a reçu les migrations de supabase/migrations/ (et un schéma `auth` avec
-- `auth.users` et `auth.uid()` ; en local, `auth.uid()` lit le réglage `request.jwt.claim.sub`).
-- Usage : lancer le script AVANT la migration 20261029000000, enregistrer la sortie, le relancer APRÈS,
-- puis comparer les deux sorties : elles doivent être identiques (chaque droit reste le même).
--   psql -At -f supabase/tests/regles_acces.sql > avant.txt
--   (appliquer la migration)
--   psql -At -f supabase/tests/regles_acces.sql > apres.txt ; diff avant.txt apres.txt
-- Chaque ligne : « qui | opération | résultat », où le résultat est le nombre de lignes lues ou touchées,
-- ou ERR:<code> si la règle refuse (42501 = refusé par une règle d'accès).

begin;

-- Fournit les identités : a et b visibles (dans une même conversation), c masqué sans conversation.
insert into auth.users (id) values
  ('aaaaaaaa-0000-0000-0000-000000000001'),
  ('bbbbbbbb-0000-0000-0000-000000000002'),
  ('cccccccc-0000-0000-0000-000000000003');

insert into public.user_profiles (user_id, username, is_visible) values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'test_a', true),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'test_b', true),
  ('cccccccc-0000-0000-0000-000000000003', 'test_c', false);

insert into public.conversations (id, participant_a, participant_b) values
  ('dddddddd-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000002');

insert into public.messages (id, conversation_id, sender_id, content) values
  ('eeeeeeee-0000-0000-0000-000000000001', 'dddddddd-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'test');

insert into public.trade_listings (user_id, mount_id, category, gender) values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'm1', 'dragodinde', 'male'),
  ('cccccccc-0000-0000-0000-000000000003', 'm1', 'dragodinde', 'male');

insert into public.trade_wanted (user_id, mount_id, gender) values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'm1', 'male');

insert into public.user_objectives (id, user_id, category, target_type, target_id) values
  ('ffffffff-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'dragodindes', 'monture', 'x');

insert into public.breeding_inventory (id, user_id, mount_id) values
  ('99999999-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'm1');

create temp table resultats (n serial, qui text, operation text, resultat text);
grant all on resultats to anon, authenticated;
grant usage on sequence resultats_n_seq to anon, authenticated;

-- Lecture : nombre de lignes visibles pour une identité.
create function pg_temp.lire(qui text, role_sql text, uid text, tbl text) returns void language plpgsql as $f$
declare n bigint; r text;
begin
  perform set_config('request.jwt.claim.sub', uid, true);
  execute 'set local role ' || role_sql;
  begin
    execute 'select count(*) from public.' || tbl into n;
    r := n::text;
  exception when others then r := 'ERR:' || sqlstate;
  end;
  execute 'reset role';
  insert into resultats (qui, operation, resultat) values (qui, 'lire ' || tbl, r);
end $f$;

-- Écriture : nombre de lignes touchées, puis tout est annulé pour que chaque essai soit indépendant.
create function pg_temp.ecrire(qui text, role_sql text, uid text, libelle text, stmt text) returns void language plpgsql as $f$
declare n bigint; r text;
begin
  perform set_config('request.jwt.claim.sub', uid, true);
  begin
    execute 'set local role ' || role_sql;
    execute stmt;
    get diagnostics n = row_count;
    r := n::text;
    raise exception 'annule';
  exception
    when others then
      if sqlerrm <> 'annule' then r := 'ERR:' || sqlstate; end if;
  end;
  execute 'reset role';
  insert into resultats (qui, operation, resultat) values (qui, libelle, r);
end $f$;

do $t$
declare
  ident text[][] := array[
    ['visiteur', 'anon', ''],
    ['a', 'authenticated', 'aaaaaaaa-0000-0000-0000-000000000001'],
    ['b', 'authenticated', 'bbbbbbbb-0000-0000-0000-000000000002'],
    ['c', 'authenticated', 'cccccccc-0000-0000-0000-000000000003']];
  tables text[] := array['user_profiles','conversations','messages','trade_listings','trade_wanted','user_objectives','breeding_inventory'];
  i int; t text;
  A text := 'aaaaaaaa-0000-0000-0000-000000000001';
  B text := 'bbbbbbbb-0000-0000-0000-000000000002';
  C text := 'cccccccc-0000-0000-0000-000000000003';
  w text[];
  ops text[][] := array[
    -- profils
    ['profil : créer le sien',        'insert into public.user_profiles (user_id, username) values (%U, ''nouveau'')'],
    ['profil : créer celui d''un autre','insert into public.user_profiles (user_id, username) values (''12345678-0000-0000-0000-000000000009'', ''x'')'],
    ['profil : modifier le sien',     'update public.user_profiles set full_name = ''m'' where user_id = %U'],
    ['profil : modifier celui de a',  'update public.user_profiles set full_name = ''m'' where user_id = ''' || A || ''''],
    -- conversations
    ['conversation : créer a->b',     'insert into public.conversations (participant_a, participant_b) values (%U, ''' || B || ''')'],
    ['conversation : créer a->c masqué','insert into public.conversations (participant_a, participant_b) values (%U, ''' || C || ''')'],
    ['conversation : créer avec soi', 'insert into public.conversations (participant_a, participant_b) values (%U, %U)'],
    ['conversation : créer au nom de a','insert into public.conversations (participant_a, participant_b) values (''' || A || ''', ''' || B || ''')'],
    ['conversation : modifier a-b',   'update public.conversations set updated_at = now() where id = ''dddddddd-0000-0000-0000-000000000001'''],
    -- messages
    ['message : envoyer dans a-b',    'insert into public.messages (conversation_id, sender_id, content) values (''dddddddd-0000-0000-0000-000000000001'', %U, ''x'')'],
    ['message : envoyer au nom de a', 'insert into public.messages (conversation_id, sender_id, content) values (''dddddddd-0000-0000-0000-000000000001'', ''' || A || ''', ''x'')'],
    ['message : marquer lu',          'update public.messages set read_at = now() where id = ''eeeeeeee-0000-0000-0000-000000000001'''],
    -- échanges
    ['échange : ajouter le sien',     'insert into public.trade_listings (user_id, mount_id, category, gender) values (%U, ''m9'', ''dragodinde'', ''male'')'],
    ['échange : ajouter pour un autre','insert into public.trade_listings (user_id, mount_id, category, gender) values (''' || A || ''', ''m9'', ''dragodinde'', ''male'')'],
    ['échange : modifier ses lignes', 'update public.trade_listings set note = ''n'' where user_id = %U'],
    ['échange : modifier celles de a','update public.trade_listings set note = ''n'' where user_id = ''' || A || ''''],
    ['échange : supprimer ses lignes','delete from public.trade_listings where user_id = %U'],
    ['échange : supprimer celles de a','delete from public.trade_listings where user_id = ''' || A || ''''],
    ['échange : lire celles de a',    'select 1 from public.trade_listings where user_id = ''' || A || ''''],
    -- recherchées, objectifs, inventaire
    ['recherché : ajouter le sien',   'insert into public.trade_wanted (user_id, mount_id, gender) values (%U, ''m9'', ''male'')'],
    ['recherché : ajouter pour a',    'insert into public.trade_wanted (user_id, mount_id, gender) values (''' || A || ''', ''m9'', ''male'')'],
    ['recherché : supprimer ceux de a','delete from public.trade_wanted where user_id = ''' || A || ''''],
    ['objectif : ajouter le sien',    'insert into public.user_objectives (user_id, category, target_type, target_id) values (%U, ''dragodindes'', ''monture'', ''y'')'],
    ['objectif : ajouter pour a',     'insert into public.user_objectives (user_id, category, target_type, target_id) values (''' || A || ''', ''dragodindes'', ''monture'', ''y'')'],
    ['objectif : modifier celui de a','update public.user_objectives set target_id = ''z'' where user_id = ''' || A || ''''],
    ['objectif : supprimer celui de a','delete from public.user_objectives where user_id = ''' || A || ''''],
    ['inventaire : ajouter le sien',  'insert into public.breeding_inventory (user_id, mount_id) values (%U, ''m9'')'],
    ['inventaire : ajouter pour a',   'insert into public.breeding_inventory (user_id, mount_id) values (''' || A || ''', ''m9'')'],
    ['inventaire : modifier celui de a','update public.breeding_inventory set done = true where user_id = ''' || A || ''''],
    ['inventaire : supprimer celui de a','delete from public.breeding_inventory where user_id = ''' || A || '''']];
begin
  for i in 1..array_length(ident, 1) loop
    foreach t in array tables loop
      perform pg_temp.lire(ident[i][1], ident[i][2], ident[i][3], t);
    end loop;
    for j in 1..array_length(ops, 1) loop
      -- %U = l'identité qui agit ; pour le visiteur, un identifiant vide donne NULL (refus attendu)
      perform pg_temp.ecrire(
        ident[i][1], ident[i][2], ident[i][3], ops[j][1],
        replace(ops[j][2], '%U', case when ident[i][3] = '' then 'NULL' else '''' || ident[i][3] || '''::uuid' end));
    end loop;
  end loop;
end $t$;

select qui || ' | ' || operation || ' | ' || resultat from resultats order by n;

rollback;
