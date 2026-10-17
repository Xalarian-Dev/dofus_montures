-- Ticket #18 : un joueur doit pouvoir supprimer ses propres objectifs.
-- Non destructive : ne touche à aucune donnée, ajoute seulement une règle d'accès.
-- Appliquée automatiquement par le dev après la fusion de la PR (vérifications + annulation prévues).
-- Annulation : drop policy "Users can delete own objectives" on public.user_objectives;

begin;

create policy "Users can delete own objectives" on public.user_objectives
  as permissive for delete to public
  using ((auth.uid() = user_id));

commit;
