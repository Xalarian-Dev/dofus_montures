import { useState, useEffect, useCallback } from 'react';

const CONSENT_KEY = 'cookie_consent';
const PREFIX = 'help_open:';

/** Le stockage local de préférences d'affichage n'est utilisé que si l'utilisateur a accepté les cookies « fonctionnels ». */
function functionalAllowed(): boolean {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    return raw ? JSON.parse(raw).functional === true : false;
  } catch {
    return false;
  }
}

function readStored(key: string): boolean | null {
  try {
    const v = localStorage.getItem(PREFIX + key);
    return v === null ? null : v === 'open';
  } catch {
    return null;
  }
}

function writeStored(key: string, open: boolean) {
  try {
    localStorage.setItem(PREFIX + key, open ? 'open' : 'closed');
  } catch {
    // Stockage indisponible : le cadre garde simplement son comportement par défaut.
  }
}

/**
 * État ouvert / réduit d'un cadre d'aide « Que faire ? ».
 * Ouvert à la première visite, puis réduit ; le choix de l'utilisateur est mémorisé dans le navigateur.
 */
export function useHelpOpen(key: string): [boolean, () => void] {
  const [open, setOpen] = useState<boolean>(() => {
    if (!functionalAllowed()) return true;
    // Première visite (rien de mémorisé) : visible.
    return readStored(key) ?? true;
  });

  // Première visite : on note que le cadre a été vu, il sera réduit aux visites suivantes.
  useEffect(() => {
    if (functionalAllowed() && readStored(key) === null) writeStored(key, false);
  }, [key]);

  const toggle = useCallback(() => {
    setOpen((prev) => {
      const next = !prev;
      if (functionalAllowed()) writeStored(key, next);
      return next;
    });
  }, [key]);

  return [open, toggle];
}
