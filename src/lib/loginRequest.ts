// Permet d'ouvrir la fenêtre de connexion (gérée par Navigation) depuis n'importe quelle page,
// par exemple depuis les cartes « Connexion requise » (ticket #81).
const LOGIN_REQUEST_EVENT = 'dofus-montures:open-login';

export function requestLogin() {
  window.dispatchEvent(new Event(LOGIN_REQUEST_EVENT));
}

export function onLoginRequest(handler: () => void) {
  window.addEventListener(LOGIN_REQUEST_EVENT, handler);
  return () => window.removeEventListener(LOGIN_REQUEST_EVENT, handler);
}
