# Dofus Montures

Site web d'aide à l'élevage de montures pour le jeu Dofus : calculateur de stratégie
d'élevage, inventaire, objectifs, échanges entre joueurs et messagerie. Les données des
joueurs connectés sont enregistrées dans une base Supabase.

Objectif commercial, public visé et adresse de production : **à compléter**.

## Lancer le site en local

Prérequis : [Node.js](https://nodejs.org) (version récente) et npm.

```bash
npm install
cp .env.example .env     # puis renseigner les deux variables (voir ci-dessous)
npm run dev              # lance le site (adresse affichée dans le terminal)
```

Autres commandes :

| Commande | Rôle |
|---|---|
| `npm run build` | vérifie les types (`tsc`) puis construit le site dans `dist/` |
| `npm run lint` | lance le correcteur de code (ESLint) |
| `npm test` | lance les tests techniques (Vitest) |
| `npm run preview` | prévisualise le site construit |

`npm test` lance des tests techniques (Vitest). Une vérification automatique (types, lint, tests, build) s'exécute aussi sur GitHub à chaque envoi de code (`.github/workflows/ci.yml`).

## Configuration

Deux variables d'environnement sont nécessaires (jamais de valeurs dans le dépôt) :

- `VITE_SUPABASE_URL` : adresse du projet Supabase ;
- `VITE_SUPABASE_ANON_KEY` : clé publique (« anon ») du projet Supabase.

Le fichier `.env.example` donne le modèle.

## Organisation du code

- `src/pages/` : une page par écran (accueil, Dragodindes, Muldos, Volkornes, calculateur,
  objectifs, échange, profil, profil public, guide, pages légales).
- `src/components/` : éléments d'interface partagés (navigation, bandeau cookies, pied de page...).
- `src/data/` : données des montures (`mounts/`), succès, expérience, serveurs.
- `src/lib/` : logique de calcul (`breedingStrategy.ts`), client Supabase, constantes.
- `src/store/` : état de l'application (inventaire, objectifs) avec Zustand.
- `src/hooks/` et `src/contexts/` : connexion, profil, échanges, messagerie.
- `supabase/migrations/` : scripts SQL de la base (structure et règles d'accès), dans l'ordre
  des dates. Les migrations qui ne détruisent rien sont appliquées automatiquement après la fusion de la
  pull request, une fois relues ; tout ce qui modifie ou supprime des données reste appliqué à la main
  dans Supabase (SQL Editor).

## Technologies

React 19, TypeScript, Vite, Mantine (interface), Zustand, React Router, Supabase.
Déploiement : Vercel (voir `vercel.json`).

## Feuille de route

À compléter.
