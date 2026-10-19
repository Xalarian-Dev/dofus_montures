import { describe, it, expect } from 'vitest';
import { validateUsername } from '@/lib/username';

describe('validateUsername', () => {
  it('accepte un nom valide', () => {
    expect(validateUsername('Bob_le-Eleveur1')).toBeNull();
  });
  it('refuse les noms réservés, quelle que soit la casse', () => {
    expect(validateUsername('guide')).not.toBeNull();
    expect(validateUsername('Profil')).not.toBeNull();
  });
  it('refuse espaces et caractères spéciaux', () => {
    expect(validateUsername('a b')).not.toBeNull();
    expect(validateUsername('x/y')).not.toBeNull();
    expect(validateUsername('a?b')).not.toBeNull();
  });
  it('refuse les noms trop courts ou trop longs', () => {
    expect(validateUsername('ab')).not.toBeNull();
    expect(validateUsername('a'.repeat(50))).not.toBeNull();
    expect(validateUsername('a'.repeat(24))).toBeNull();
  });
});
