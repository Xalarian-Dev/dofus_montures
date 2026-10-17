-- Ticket #33 : un profil masqué ne doit pas pouvoir être « démasqué » par un inconnu.
-- Non destructive : ne touche à aucune donnée, resserre seulement deux règles d'accès.
-- Appliquée automatiquement par le dev après la fusion de la PR (vérifications + annulation prévues).

begin;

-- 1. Conversations : on ne peut en créer une qu'en son propre nom, avec quelqu'un d'autre,
--    dont le profil est visible. Les conversations déjà existantes ne sont pas touchées.
drop policy if exists "Auth create" on public.conversations;
create policy "Auth create" on public.conversations
  as permissive for insert to public
  with check (
    auth.uid() = participant_a
    and participant_b <> participant_a
    and exists (
      select 1 from public.user_profiles p
      where p.user_id = participant_b
        and p.is_visible
    )
  );

-- 2. Annonces d'échange : lisibles seulement pour les profils visibles (et ses propres annonces).
drop policy if exists "Public read" on public.trade_listings;
create policy "Public read" on public.trade_listings
  as permissive for select to public
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.user_profiles p
      where p.user_id = trade_listings.user_id
        and p.is_visible
    )
  );

commit;
