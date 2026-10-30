-- Ticket #63 : accélérer les règles d'accès (alertes Supabase auth_rls_initplan et
-- multiple_permissive_policies, index manquants sur clés étrangères).
-- Non destructive : aucune ligne n'est modifiée ni supprimée. Les règles gardent EXACTEMENT le même
-- sens : seul `auth.uid()` devient `(select auth.uid())`, ce qui évite de le recalculer à chaque ligne.
-- Deux doublons sont retirés sans changer qui a le droit de quoi :
--   - user_profiles : « Users can update own profile » est identique à « Own update » ;
--   - trade_listings : « Own write » (ALL) recouvrait « Public read » (SELECT) ; elle est remplacée par
--     trois règles qui ne couvrent que l'écriture (la lecture de ses propres lignes reste permise par
--     « Public read », qui contient `user_id = auth.uid()`).
-- Appliquée automatiquement par le dev après la fusion de la PR (vérifications + annulation prévues).
-- Annulation : supabase/annulations/20261029000000_regles_acces_performance_annulation.sql
-- Test à deux comptes : supabase/tests/regles_acces.sql

begin;

alter policy "Users can manage their own inventory" on public.breeding_inventory
  using ((select auth.uid()) = user_id);

alter policy "Auth create" on public.conversations
  with check (
    ((select auth.uid()) = participant_a)
    and (participant_b <> participant_a)
    and exists (
      select 1 from public.user_profiles p
      where p.user_id = conversations.participant_b and p.is_visible
    )
  );

-- « Participants read » (conversations) reste volontairement avec `auth.uid()` tel quel : avec
-- `(select auth.uid())`, la création d'une conversation échouerait (erreur « infinite recursion detected
-- in policy » : les règles de conversations et de user_profiles se citent l'une l'autre). L'alerte
-- auth_rls_initplan restera donc signalée pour cette seule règle (testé : supabase/tests/regles_acces.sql).

alter policy "Participants update" on public.conversations
  using (((select auth.uid()) = participant_a) or ((select auth.uid()) = participant_b))
  with check (((select auth.uid()) = participant_a) or ((select auth.uid()) = participant_b));

alter policy "Mark read" on public.messages
  using (
    (sender_id <> (select auth.uid()))
    and exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
        and ((c.participant_a = (select auth.uid())) or (c.participant_b = (select auth.uid())))
    )
  )
  with check (
    (sender_id <> (select auth.uid()))
    and exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
        and ((c.participant_a = (select auth.uid())) or (c.participant_b = (select auth.uid())))
    )
  );

alter policy "Participants read" on public.messages
  using (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
        and ((c.participant_a = (select auth.uid())) or (c.participant_b = (select auth.uid())))
    )
  );

alter policy "Participants send" on public.messages
  with check (
    (sender_id = (select auth.uid()))
    and exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
        and ((c.participant_a = (select auth.uid())) or (c.participant_b = (select auth.uid())))
    )
  );

-- trade_listings : « Own write » (ALL) est remplacée par trois règles d'écriture.
drop policy "Own write" on public.trade_listings;

create policy "Own insert" on public.trade_listings
  for insert to public
  with check ((select auth.uid()) = user_id);

create policy "Own update" on public.trade_listings
  for update to public
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Own delete" on public.trade_listings
  for delete to public
  using ((select auth.uid()) = user_id);

alter policy "Public read" on public.trade_listings
  using (
    (user_id = (select auth.uid()))
    or exists (
      select 1 from public.user_profiles p
      where p.user_id = trade_listings.user_id and p.is_visible
    )
  );

alter policy "Own wanted" on public.trade_wanted
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

alter policy "Users can delete own objectives" on public.user_objectives
  using ((select auth.uid()) = user_id);

alter policy "Users can read own objectives" on public.user_objectives
  using ((select auth.uid()) = user_id);

alter policy "Users can update own objectives" on public.user_objectives
  using ((select auth.uid()) = user_id);

alter policy "Users can upsert own objectives" on public.user_objectives
  with check ((select auth.uid()) = user_id);

alter policy "Own insert" on public.user_profiles
  with check ((select auth.uid()) = user_id);

alter policy "Own update" on public.user_profiles
  using ((select auth.uid()) = user_id);

drop policy "Users can update own profile" on public.user_profiles;

alter policy "Read visible, own or shared conversation" on public.user_profiles
  using (
    is_visible
    or (user_id = (select auth.uid()))
    or exists (
      select 1 from public.conversations c
      where ((c.participant_a = (select auth.uid())) and (c.participant_b = user_profiles.user_id))
         or ((c.participant_b = (select auth.uid())) and (c.participant_a = user_profiles.user_id))
    )
  );

-- Index sur les clés étrangères (alerte unindexed_foreign_keys).
create index if not exists conversations_participant_a_idx on public.conversations (participant_a);
create index if not exists conversations_participant_b_idx on public.conversations (participant_b);
create index if not exists messages_sender_id_idx on public.messages (sender_id);

commit;
