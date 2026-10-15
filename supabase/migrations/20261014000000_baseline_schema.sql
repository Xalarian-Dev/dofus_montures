-- Instantané de la structure de la base Supabase (schéma "public"), ticket #9.
-- Reconstitué à partir de l'export en lecture seule collé dans le ticket (14 octobre 2026).
-- ATTENTION : ce fichier DÉCRIT l'état actuel de la base. Il n'a PAS été appliqué et ne doit
-- PAS être rejoué sur la base de production (les objets y existent déjà). Il sert de
-- référence et à recréer un projet de test vide.
-- Les correctifs de règles sont dans les tickets #17 et #18 (pas ici).
-- Non couvert par l'export : les droits par défaut Supabase (anon / authenticated), les
-- déclencheurs d'événements (ex. rls_auto_enable) et la publication temps réel (vide).

create table public.breeding_inventory (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null,
  mount_id text not null,
  male_count integer default 0,
  female_count integer default 0,
  updated_at timestamp with time zone default now(),
  done boolean not null default false,
  step_done boolean default false,
  step_count integer default 0,
  step_male_count integer default 0,
  step_female_count integer default 0,
  constraint breeding_inventory_pkey PRIMARY KEY (id),
  constraint breeding_inventory_user_id_mount_id_key UNIQUE (user_id, mount_id)
);

create table public.conversations (
  id uuid not null default gen_random_uuid(),
  participant_a uuid not null,
  participant_b uuid not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  constraint conversations_pkey PRIMARY KEY (id)
);

create table public.messages (
  id uuid not null default gen_random_uuid(),
  conversation_id uuid not null,
  sender_id uuid not null,
  content text not null,
  created_at timestamp with time zone default now(),
  read_at timestamp with time zone,
  constraint messages_pkey PRIMARY KEY (id)
);

create table public.trade_listings (
  user_id uuid not null,
  mount_id text not null,
  category text not null,
  gender text not null,
  quantity integer not null default 1,
  note text,
  created_at timestamp with time zone default now(),
  constraint trade_listings_gender_check CHECK ((gender = ANY (ARRAY['male'::text, 'female'::text]))),
  constraint trade_listings_pkey PRIMARY KEY (user_id, mount_id, gender)
);

create table public.user_objectives (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null,
  category text not null,
  target_type text not null,
  target_id text not null,
  updated_at timestamp with time zone not null default now(),
  allow_cloning boolean not null default false,
  constraint user_objectives_category_check CHECK ((category = ANY (ARRAY['dragodindes'::text, 'muldos'::text, 'volkornes'::text]))),
  constraint user_objectives_pkey PRIMARY KEY (id),
  constraint user_objectives_target_type_check CHECK ((target_type = ANY (ARRAY['monture'::text, 'succes'::text]))),
  constraint user_objectives_user_id_category_key UNIQUE (user_id, category)
);

create table public.user_profiles (
  user_id uuid not null,
  username text,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone default now(),
  ingame_name text,
  is_visible boolean not null default true,
  realm text,
  constraint user_profiles_pkey PRIMARY KEY (user_id)
);

-- Clés étrangères (après création des tables)
alter table public.breeding_inventory add constraint breeding_inventory_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
alter table public.conversations add constraint conversations_participant_a_fkey FOREIGN KEY (participant_a) REFERENCES auth.users(id) ON DELETE CASCADE;
alter table public.conversations add constraint conversations_participant_b_fkey FOREIGN KEY (participant_b) REFERENCES auth.users(id) ON DELETE CASCADE;
alter table public.messages add constraint messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE;
alter table public.messages add constraint messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES auth.users(id) ON DELETE CASCADE;
alter table public.trade_listings add constraint trade_listings_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
alter table public.user_objectives add constraint user_objectives_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
alter table public.user_profiles add constraint user_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Index (hors clés primaires et contraintes d'unicité déjà créées ci-dessus)
CREATE UNIQUE INDEX user_profiles_username_key ON public.user_profiles USING btree (username);
CREATE UNIQUE INDEX user_profiles_username_unique ON public.user_profiles USING btree (username) WHERE (username IS NOT NULL);

-- Row Level Security
alter table public.breeding_inventory enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.trade_listings enable row level security;
alter table public.user_objectives enable row level security;
alter table public.user_profiles enable row level security;

create policy "Users can manage their own inventory" on public.breeding_inventory
  as permissive for all to public
  using ((auth.uid() = user_id));

create policy "Auth create" on public.conversations
  as permissive for insert to public
  with check (((auth.uid() = participant_a) OR (auth.uid() = participant_b)));

create policy "Participants read" on public.conversations
  as permissive for select to public
  using (((auth.uid() = participant_a) OR (auth.uid() = participant_b)));

create policy "Participants update" on public.conversations
  as permissive for update to public
  using (((auth.uid() = participant_a) OR (auth.uid() = participant_b)));

create policy "Mark read" on public.messages
  as permissive for update to public
  using ((EXISTS ( SELECT 1
   FROM conversations c
  WHERE ((c.id = messages.conversation_id) AND ((c.participant_a = auth.uid()) OR (c.participant_b = auth.uid()))))));

create policy "Participants read" on public.messages
  as permissive for select to public
  using ((EXISTS ( SELECT 1
   FROM conversations c
  WHERE ((c.id = messages.conversation_id) AND ((c.participant_a = auth.uid()) OR (c.participant_b = auth.uid()))))));

create policy "Participants send" on public.messages
  as permissive for insert to public
  with check (((sender_id = auth.uid()) AND (EXISTS ( SELECT 1
   FROM conversations c
  WHERE ((c.id = messages.conversation_id) AND ((c.participant_a = auth.uid()) OR (c.participant_b = auth.uid())))))));

create policy "Own write" on public.trade_listings
  as permissive for all to public
  using ((auth.uid() = user_id));

create policy "Public read" on public.trade_listings
  as permissive for select to public
  using (true);

create policy "Users can read own objectives" on public.user_objectives
  as permissive for select to public
  using ((auth.uid() = user_id));

create policy "Users can update own objectives" on public.user_objectives
  as permissive for update to public
  using ((auth.uid() = user_id));

create policy "Users can upsert own objectives" on public.user_objectives
  as permissive for insert to public
  with check ((auth.uid() = user_id));

create policy "Own insert" on public.user_profiles
  as permissive for insert to public
  with check ((auth.uid() = user_id));

create policy "Own update" on public.user_profiles
  as permissive for update to public
  using ((auth.uid() = user_id));

create policy "Public read" on public.user_profiles
  as permissive for select to public
  using (true);

create policy "Users can read own profile" on public.user_profiles
  as permissive for select to public
  using (true);

create policy "Users can update own profile" on public.user_profiles
  as permissive for update to public
  using ((user_id = auth.uid()));

-- Fonctions
CREATE OR REPLACE FUNCTION public.delete_own_account()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.user_profiles (user_id, full_name, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (user_id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = now();
  RETURN new;
END;
$function$;

CREATE OR REPLACE FUNCTION public.rls_auto_enable()
 RETURNS event_trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog'
AS $function$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$function$;
