// Alerte unique du calculateur, gardée dans le navigateur (localStorage).

const STORAGE_KEY = 'calc-alert';
export const CALC_ALERT_EVENT = 'calc-alert-change';

export interface CalcAlert {
  /** Heure de fin, en millisecondes (Date.now()). */
  endAt: number;
  label: string;
}

export function isCalcAlert(value: unknown): value is CalcAlert {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.endAt === 'number' && Number.isFinite(v.endAt) && typeof v.label === 'string';
}

export function readCalcAlert(): CalcAlert | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isCalcAlert(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function notifyChange() {
  window.dispatchEvent(new Event(CALC_ALERT_EVENT));
}

export function saveCalcAlert(alert: CalcAlert) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alert));
  } catch {
    // stockage indisponible : l'alerte ne sera pas gardée
  }
  notifyChange();
}

export function clearCalcAlert() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // rien à faire
  }
  notifyChange();
}
