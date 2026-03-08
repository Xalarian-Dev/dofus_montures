import { BreedingInventory, MountSpecies } from '@/types/mount';

export interface BreedingBreed {
  mount: MountSpecies;
  parents: [MountSpecies, MountSpecies];
  count: number;
}

export interface BreedingStep {
  generation: number;
  breeds: BreedingBreed[];
  totalCount: number;
}

export interface BreedingStrategy {
  targets: MountSpecies[];
  captures: { mount: MountSpecies; count: number }[];
  totalCaptures: number;
  steps: BreedingStep[];
  totalBreeds: number;
}

export function buildStrategy(
  targetIds: string[],
  allMounts: MountSpecies[],
  allowCloning = false,
  inventory?: BreedingInventory
): BreedingStrategy {
  const mountMap = new Map(allMounts.map((m) => [m.id, m]));

  // Collect all mounts reachable from targets (via parents[0])
  const allNeeded = new Set<string>();
  const stack = [...targetIds];
  while (stack.length) {
    const id = stack.pop()!;
    if (allNeeded.has(id)) continue;
    allNeeded.add(id);
    const mount = mountMap.get(id);
    if (mount?.generation > 1 && mount.parents?.length) {
      const [a, b] = mount.parents[0];
      stack.push(a, b);
    }
  }

  // Count direct targets
  const targetCounts = new Map<string, number>();
  for (const id of targetIds) {
    targetCounts.set(id, (targetCounts.get(id) ?? 0) + 1);
  }

  // Top-down DP: process from highest gen to lowest.
  // production(M) = max(target_count(M), parent_demand(M))
  // A sterile mount still satisfies the collection requirement, so a mount
  // used as parent N times only needs max(target_count, N) total copies — not N+target_count.
  // For each mount, propagate its production count to its parents as parent_demand.
  const parentDemand = new Map<string, number>();
  const productionCounts = new Map<string, number>();

  const sortedNeeded = [...allNeeded].sort(
    (a, b) => (mountMap.get(b)?.generation ?? 0) - (mountMap.get(a)?.generation ?? 0)
  );

  for (const id of sortedNeeded) {
    const tc = targetCounts.get(id) ?? 0;
    const pd = parentDemand.get(id) ?? 0;
    const required = Math.max(tc, pd);

    // Inventory: if done, treat as fully satisfied; otherwise subtract what's already owned.
    const inv = inventory?.[id];
    let prod: number;
    if (inv?.done) {
      prod = 0;
    } else {
      const available = (inv?.maleCount ?? 0) + (inv?.femaleCount ?? 0);
      prod = Math.max(0, required - available);
    }

    // With cloning: for every 3 copies needed, only 2 must be bred.
    // Savings propagate to parents.
    const breedProd = allowCloning ? prod - Math.floor(prod / 3) : prod;

    productionCounts.set(id, prod);

    const mount = mountMap.get(id);
    if (mount?.generation > 1 && mount.parents?.length) {
      const [a, b] = mount.parents[0];
      parentDemand.set(a, (parentDemand.get(a) ?? 0) + breedProd);
      parentDemand.set(b, (parentDemand.get(b) ?? 0) + breedProd);
    }
  }

  const targets = targetIds.map((id) => mountMap.get(id)!).filter(Boolean);
  const captures: { mount: MountSpecies; count: number }[] = [];
  const byGen = new Map<number, BreedingBreed[]>();

  for (const [mountId, prod] of productionCounts.entries()) {
    if (prod <= 0) continue;
    const mount = mountMap.get(mountId);
    if (!mount) continue;

    if (mount.generation <= 1) {
      captures.push({ mount, count: prod });
      continue;
    }
    if (!mount.parents?.length) continue;

    const [aId, bId] = mount.parents[0];
    const parentA = mountMap.get(aId);
    const parentB = mountMap.get(bId);
    if (!parentA || !parentB) continue;

    if (!byGen.has(mount.generation)) byGen.set(mount.generation, []);
    byGen.get(mount.generation)!.push({ mount, parents: [parentA, parentB], count: prod });
  }

  const totalCaptures = captures.reduce((sum, c) => sum + c.count, 0);

  const steps: BreedingStep[] = [...byGen.entries()]
    .sort(([a], [b]) => a - b)
    .map(([generation, breeds]) => ({
      generation,
      breeds,
      totalCount: breeds.reduce((sum, b) => sum + b.count, 0),
    }));

  const totalBreeds = steps.reduce((sum, s) => sum + s.totalCount, 0);

  return { targets, captures, totalCaptures, steps, totalBreeds };
}

export function buildSuccesStrategy(
  achievementId: string,
  allMounts: MountSpecies[],
  allowCloning = false,
  inventory?: BreedingInventory
): BreedingStrategy {
  const breedableMounts = allMounts.filter((m) => m.generation > 0);

  if (achievementId === 'meta') {
    return buildStrategy(breedableMounts.map((m) => m.id), allMounts, allowCloning, inventory);
  }

  const gen = parseInt(achievementId.replace('gen_', ''), 10);
  if (isNaN(gen)) return { targets: [], captures: [], totalCaptures: 0, steps: [], totalBreeds: 0 };

  if (gen === 1) {
    const gen1 = breedableMounts.filter((m) => m.generation === 1);
    return {
      targets: gen1,
      captures: gen1.filter((m) => !inventory?.[m.id]?.done).map((m) => {
        const inv = inventory?.[m.id];
        const available = (inv?.maleCount ?? 0) + (inv?.femaleCount ?? 0);
        const count = Math.max(0, 1 - available);
        return { mount: m, count };
      }).filter((c) => c.count > 0),
      totalCaptures: gen1.filter((m) => !inventory?.[m.id]?.done).reduce((sum, m) => {
        const inv = inventory?.[m.id];
        const available = (inv?.maleCount ?? 0) + (inv?.femaleCount ?? 0);
        return sum + Math.max(0, 1 - available);
      }, 0),
      steps: [],
      totalBreeds: 0,
    };
  }

  const targetIds = breedableMounts.filter((m) => m.generation === gen).map((m) => m.id);
  return buildStrategy(targetIds, allMounts, allowCloning, inventory);
}
