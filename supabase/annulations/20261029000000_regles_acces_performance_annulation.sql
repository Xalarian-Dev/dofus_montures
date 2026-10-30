-- Annulation de 20261029000000_regles_acces_performance.sql : remet les règles d'accès et l'état des
-- index exactement comme avant (règles relevées dans la base le 2026-10-29).
-- À lancer seulement si la migration a causé un problème. Ne touche à aucune donnée.

begin;

drop index if exists public.conversations_participant_a_idx;
drop index if exists public.conversations_participant_b_idx;
drop index if exists public.messages_sender_id_idx;

alter policy "Users can manage their own inventory" on public.breeding_inventory
  using (auth.uid() = user_id);

alter policy "Auth create" on public.conversations
  with check (
    (auth.uid() = participant_a)
    and (participant_b <> participant_a)
    and exists (
      select 1 from public.user_profiles p
      where p.user_id = conversations.participant_b and p.is_visible
    )
  );

alter policy "Participants read" on public.conversations
  using ((auth.uid() = participant_a) or (auth.uid() = participant_b));

alter policy "Participants update" on public.conversations
  using ((auth.uid() = participant_a) or (auth.uid() = participant_b))
  with check ((auth.uid() = participant_a) or (auth.uid() = participant_b));

alter policy "Mark read" on public.messages
  using (
    (sender_id <> auth.uid())
    and exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
        and ((c.participant_a = auth.uid()) or (c.participant_b = auth.uid()))
    )
  )
  with check (
    (sender_id <> auth.uid())
    and exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
        and ((c.participant_a = auth.uid()) or (c.participant_b = auth.uid()))
    )
  );

alter policy "Participants read" on public.messages
  using (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
        and ((c.participant_a = auth.uid()) or (c.participant_b = auth.uid()))
    )
  );

alter policy "Participants send" on public.messages
  with check (
    (sender_id = auth.uid())
    and exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
        and ((c.participant_a = auth.uid()) or (c.participant_b = auth.uid()))
    )
  );

drop policy "Own insert" on public.trade_listings;
drop policy "Own update" on public.trade_listings;
drop policy "Own delete" on public.trade_listings;

create policy "Own write" on public.trade_listings
  for all to public
  using (auth.uid() = user_id);

alter policy "Public read" on public.trade_listings
  using (
    (user_id = auth.uid())
    or exists (
      select 1 from public.user_profiles p
      where p.user_id = trade_listings.user_id and p.is_visible
    )
  );

alter policy "Own wanted" on public.trade_wanted
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

alter policy "Users can delete own objectives" on public.user_objectives
  using (auth.uid() = user_id);

alter policy "Users can read own objectives" on public.user_objectives
  using (auth.uid() = user_id);

alter policy "Users can update own objectives" on public.user_objectives
  using (auth.uid() = user_id);

alter policy "Users can upsert own objectives" on public.user_objectives
  with check (auth.uid() = user_id);

alter policy "Own insert" on public.user_profiles
  with check (auth.uid() = user_id);

alter policy "Own update" on public.user_profiles
  using (auth.uid() = user_id);

create policy "Users can update own profile" on public.user_profiles
  for update to public
  using (user_id = auth.uid());

alter policy "Read visible, own or shared conversation" on public.user_profiles
  using (
    is_visible
    or (user_id = auth.uid())
    or exists (
      select 1 from public.conversations c
      where ((c.participant_a = auth.uid()) and (c.participant_b = user_profiles.user_id))
         or ((c.participant_b = auth.uid()) and (c.participant_a = user_profiles.user_id))
    )
  );

commit;
