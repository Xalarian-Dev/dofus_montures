// Règles des noms d'utilisateur (le nom sert d'adresse de profil : /MonPseudo).
export const USERNAME_MIN = 3;
export const USERNAME_MAX = 24;
const USERNAME_FORMAT = /^[A-Za-z0-9_-]+$/;

// Noms de pages du site (voir src/App.tsx) et noms gardés pour plus tard :
// un profil qui porterait l'un de ces noms serait inaccessible.
export const RESERVED_USERNAMES = [
  'dragodindes', 'muldos', 'volkornes', 'caracteristiques', 'guide', 'echange', 'auth',
  'politique-de-confidentialite', 'mentions-legales', 'calculateur', 'profil',
  'admin', 'api', 'assets', 'login',
];

// Renvoie un message d'erreur en français, ou null si le nom est valide.
export function validateUsername(username: string): string | null {
  if (!username) return 'Le nom ne peut pas être vide.';
  if (username.length < USERNAME_MIN) return `Minimum ${USERNAME_MIN} caractères.`;
  if (username.length > USERNAME_MAX) return `Maximum ${USERNAME_MAX} caractères.`;
  if (!USERNAME_FORMAT.test(username)) return 'Uniquement des lettres, des chiffres, « - » et « _ » (pas d\'espace ni d\'accent).';
  if (RESERVED_USERNAMES.includes(username.toLowerCase())) return 'Ce nom est réservé, choisis-en un autre.';
  return null;
}
