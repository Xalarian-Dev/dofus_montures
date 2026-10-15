import { describe, expect, it } from 'vitest';
import { dragodindes } from '@/data/mounts/dragodindes';
import { muldos } from '@/data/mounts/muldos';
import { volkornes } from '@/data/mounts/volkornes';
import type { MountSpecies } from '@/types/mount';

// Liste des images présentes dans public/assets/sprites (chemins comme dans les données : /assets/...).
const spriteFiles = new Set(
  Object.keys(import.meta.glob('/public/assets/sprites/**/*.png')).map((p) => p.replace('/public', '')),
);

const all: MountSpecies[] = [...dragodindes, ...muldos, ...volkornes];
const byId = new Map(all.map((m) => [m.id, m]));

describe('données des montures', () => {
  it('contient des montures', () => {
    expect(all.length).toBeGreaterThan(0);
  });

  it('a des identifiants uniques', () => {
    const ids = all.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('range chaque monture dans la bonne catégorie', () => {
    for (const m of dragodindes) expect(m.category).toBe('dragodindes');
    for (const m of muldos) expect(m.category).toBe('muldos');
    for (const m of volkornes) expect(m.category).toBe('volkornes');
  });

  it('ne référence que des parents qui existent', () => {
    const missing: string[] = [];
    for (const m of all) {
      for (const pair of m.parents ?? []) {
        for (const parentId of pair) {
          if (!byId.has(parentId)) missing.push(`${m.id} -> ${parentId}`);
        }
      }
    }
    expect(missing).toEqual([]);
  });

  it('n\'a pas de cycle dans les croisements', () => {
    // 0 = en cours de visite, 1 = terminé
    const state = new Map<string, number>();
    const cycles: string[] = [];
    const visit = (id: string, path: string[]) => {
      if (state.get(id) === 1) return;
      if (state.get(id) === 0) {
        cycles.push([...path, id].join(' -> '));
        return;
      }
      state.set(id, 0);
      for (const pair of byId.get(id)?.parents ?? []) {
        for (const parentId of pair) visit(parentId, [...path, id]);
      }
      state.set(id, 1);
    };
    for (const m of all) visit(m.id, []);
    expect(cycles).toEqual([]);
  });

  it('pointe vers des images qui existent dans public/', () => {
    const missing = all
      .filter((m) => m.sprite)
      .filter((m) => !spriteFiles.has(m.sprite!))
      .map((m) => `${m.id}: ${m.sprite}`);
    expect(missing).toEqual([]);
  });
});
