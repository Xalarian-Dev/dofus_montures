-- Ticket #4 : règles sur les noms d'utilisateur (adresse du profil public).
-- Non destructive : ne modifie aucune donnée. Ajoute un index et une contrainte.
-- Le nom reste facultatif (107 profils n'en ont pas encore) : NULL est accepté.
-- La contrainte est "not valid" : elle s'applique aux nouveaux noms et aux modifications,
-- sans relire les anciennes lignes (le propriétaire a vérifié : 0 cas non conforme, 0 doublon).
-- Appliquée automatiquement par le dev après la fusion de la PR (vérifications + annulation prévues).
-- Annulation :
--   drop index if exists public.user_profiles_username_lower_key;
--   alter table public.user_profiles drop constraint if exists user_profiles_username_format;

begin;

create unique index user_profiles_username_lower_key
  on public.user_profiles (lower(username))
  where username is not null;

alter table public.user_profiles
  add constraint user_profiles_username_format
  check (username is null or username ~ '^[A-Za-z0-9_-]{3,24}$') not valid;

commit;
