import { describe, expect, it } from 'vitest';
import { isCalcAlert } from '@/lib/calcAlert';

describe('alerte du calculateur', () => {
  it('accepte une alerte valide', () => {
    expect(isCalcAlert({ endAt: 1760000000000, label: 'Niveau 100 atteint' })).toBe(true);
  });

  it('refuse une valeur mal formée (stockage modifié ou ancien)', () => {
    expect(isCalcAlert(null)).toBe(false);
    expect(isCalcAlert('texte')).toBe(false);
    expect(isCalcAlert({ endAt: 'demain', label: 'x' })).toBe(false);
    expect(isCalcAlert({ endAt: NaN, label: 'x' })).toBe(false);
    expect(isCalcAlert({ endAt: 1 })).toBe(false);
  });
});
