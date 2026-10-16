-- Ticket #7 : messagerie, moins de requêtes (option B décidée par le propriétaire).
-- À APPLIQUER PAR LE PROPRIÉTAIRE (le dev automatique n'applique jamais une migration).
-- À appliquer AVANT de fusionner la PR : le site utilisera la fonction my_conversations()
-- et la colonne recipient_id dès sa mise en ligne.

begin;

-- 1. Destinataire de chaque message : permet de n'écouter en direct que SES messages reçus.
alter table public.messages add column if not exists recipient_id uuid;

update public.messages m
   set recipient_id = case when c.participant_a = m.sender_id then c.participant_b else c.participant_a end
  from public.conversations c
 where c.id = m.conversation_id
   and m.recipient_id is null;

create or replace function public.set_message_recipient()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  select case when c.participant_a = new.sender_id then c.participant_b else c.participant_a end
    into new.recipient_id
    from public.conversations c
   where c.id = new.conversation_id;
  return new;
end;
$$;

drop trigger if exists messages_set_recipient on public.messages;
create trigger messages_set_recipient
  before insert on public.messages
  for each row execute function public.set_message_recipient();

create index if not exists messages_recipient_id_idx on public.messages (recipient_id);
create index if not exists messages_conversation_created_idx on public.messages (conversation_id, created_at desc);

-- 2. Liste des conversations (dernier message + non-lus) en UNE requête.
--    security invoker : les règles d'accès (RLS) de l'utilisateur s'appliquent.
create or replace function public.my_conversations()
returns table (
  id uuid,
  participant_a uuid,
  participant_b uuid,
  updated_at timestamp with time zone,
  last_message_id uuid,
  last_message_sender_id uuid,
  last_message_content text,
  last_message_created_at timestamp with time zone,
  last_message_read_at timestamp with time zone,
  unread_count bigint
)
language sql
stable
security invoker
set search_path = public
as $$
  select c.id, c.participant_a, c.participant_b, c.updated_at,
         lm.id, lm.sender_id, lm.content, lm.created_at, lm.read_at,
         (select count(*) from public.messages u
           where u.conversation_id = c.id
             and u.sender_id <> auth.uid()
             and u.read_at is null)
    from public.conversations c
    left join lateral (
      select m.id, m.sender_id, m.content, m.created_at, m.read_at
        from public.messages m
       where m.conversation_id = c.id
       order by m.created_at desc
       limit 1
    ) lm on true
   where c.participant_a = auth.uid() or c.participant_b = auth.uid()
   order by c.updated_at desc;
$$;

revoke all on function public.my_conversations() from public, anon;
grant execute on function public.my_conversations() to authenticated;

commit;
