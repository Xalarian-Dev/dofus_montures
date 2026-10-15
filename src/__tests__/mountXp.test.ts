import { describe, expect, it } from 'vitest';
import {
  MOUNT_XP_CUMULATIVE,
  MOUNT_XP_PER_LEVEL,
  xpBetweenLevels,
  xpToReachLevel,
} from '@/data/mountXp';

describe('table d\'expérience des montures', () => {
  it('couvre les niveaux 1 à 200 et commence à 0', () => {
    expect(MOUNT_XP_CUMULATIVE).toHaveLength(200);
    expect(xpToReachLevel(1)).toBe(0);
  });

  it('augmente strictement à chaque niveau', () => {
    for (let i = 1; i < MOUNT_XP_CUMULATIVE.length; i++) {
      expect(MOUNT_XP_CUMULATIVE[i]).toBeGreaterThan(MOUNT_XP_CUMULATIVE[i - 1]);
    }
  });

  it('a 199 paliers dont la somme donne l\'expérience du niveau 200', () => {
    expect(MOUNT_XP_PER_LEVEL).toHaveLength(199);
    const total = MOUNT_XP_PER_LEVEL.reduce((a, b) => a + b, 0);
    expect(total).toBe(xpToReachLevel(200));
  });

  it('renvoie 0 pour un niveau hors limites', () => {
    expect(xpToReachLevel(0)).toBe(0);
    expect(xpToReachLevel(201)).toBe(0);
  });

  it('calcule l\'expérience entre deux niveaux', () => {
    expect(xpBetweenLevels(1, 2)).toBe(MOUNT_XP_CUMULATIVE[1]);
    expect(xpBetweenLevels(10, 10)).toBe(0);
    expect(xpBetweenLevels(50, 100)).toBe(xpToReachLevel(100) - xpToReachLevel(50));
  });
});
