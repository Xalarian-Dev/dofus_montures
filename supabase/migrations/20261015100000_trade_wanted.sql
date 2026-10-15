-- Ticket #10 : sauvegarder les montures recherchées (page Échange).
-- À APPLIQUER PAR LE PROPRIÉTAIRE (le dev automatique n'applique jamais une migration).

begin;

create table if not exists public.trade_wanted (
  user_id uuid not null,
  mount_id text not null,
  gender text not null,
  created_at timestamp with time zone default now(),
  constraint trade_wanted_gender_check check (gender = any (array['male'::text, 'female'::text])),
  constraint trade_wanted_pkey primary key (user_id, mount_id, gender),
  constraint trade_wanted_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade
);

alter table public.trade_wanted enable row level security;

-- Chacun ne voit et ne modifie que ses propres montures recherchées.
-- (Aucune lecture publique : elle ne serait utile qu'à l'étape 2 du ticket, non incluse ici.)
create policy "Own wanted" on public.trade_wanted
  as permissive for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

commit;
