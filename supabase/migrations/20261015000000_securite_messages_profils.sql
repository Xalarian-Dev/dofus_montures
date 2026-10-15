-- Ticket #17 : sécurité des messages, des conversations et des profils masqués.
-- À APPLIQUER PAR LE PROPRIÉTAIRE (le dev automatique n'applique jamais une migration).

-- 1. Messages : seule la colonne « read_at » est modifiable, et seulement par le destinataire.
revoke update on public.messages from anon, authenticated;
grant update (read_at) on public.messages to authenticated;

drop policy if exists "Mark read" on public.messages;
create policy "Mark read" on public.messages
  as permissive for update to authenticated
  using (
    sender_id <> auth.uid()
    and exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
        and (c.participant_a = auth.uid() or c.participant_b = auth.uid())
    )
  )
  with check (
    sender_id <> auth.uid()
    and exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
        and (c.participant_a = auth.uid() or c.participant_b = auth.uid())
    )
  );

-- 2. Conversations : seule la colonne « updated_at » est modifiable (pas les participants).
revoke update on public.conversations from anon, authenticated;
grant update (updated_at) on public.conversations to authenticated;

drop policy if exists "Participants update" on public.conversations;
create policy "Participants update" on public.conversations
  as permissive for update to authenticated
  using ((auth.uid() = participant_a) or (auth.uid() = participant_b))
  with check ((auth.uid() = participant_a) or (auth.uid() = participant_b));

-- 3. Profils : lisibles seulement s'ils sont visibles, ou si c'est le sien,
--    ou si on partage une conversation avec cette personne.
drop policy if exists "Public read" on public.user_profiles;
drop policy if exists "Users can read own profile" on public.user_profiles;
create policy "Read visible, own or shared conversation" on public.user_profiles
  as permissive for select to public
  using (
    is_visible
    or user_id = auth.uid()
    or exists (
      select 1 from public.conversations c
      where (c.participant_a = auth.uid() and c.participant_b = user_profiles.user_id)
         or (c.participant_b = auth.uid() and c.participant_a = user_profiles.user_id)
    )
  );

-- 4. Fonctions « security definer » : fixer le chemin de recherche (gravité basse).
alter function public.delete_own_account() set search_path = '';
alter function public.handle_new_user() set search_path = '';
