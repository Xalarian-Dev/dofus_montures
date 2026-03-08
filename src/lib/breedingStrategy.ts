import { MountSpecies } from '@/types/mount';

export type StrategyMode = 'simple' | 'complex';

export interface BreedingBreed {
  mount: MountSpecies;
  parents: [MountSpecies, MountSpecies];
  count: number;
  /** Simple mode only: number of other valid parent pairs not shown. 0 in complex mode. */
  alternativePairsCount: number;
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

// Count how many ancestors of `pair` are already in `allNeeded` (promotes reuse).
function countSharedAncestors(
  pair: [string, string],
  allNeeded: Set<string>,
  mountMap: Map<string, MountSpecies>,
): number {
  let count = 0;
  const stack = [...pair];
  const visited = new Set<string>();
  while (stack.length) {
    const id = stack.pop()!;
    if (visited.has(id)) continue;
    visited.add(id);
    if (allNeeded.has(id)) {
      count++;
      continue; // already needed — don't recurse further down this branch
    }
    const mount = mountMap.get(id);
    if (mount && mount.generation > 1 && mount.parents?.length) {
      stack.push(...mount.parents[0]);
    }
  }
  return count;
}

// Among all parent pair options for a mount, pick the one with most overlap
// with already-needed mounts (greedy reuse heuristic).
function chooseBestPair(
  pairs: [string, string][],
  allNeeded: Set<string>,
  mountMap: Map<string, MountSpecies>,
): [string, string] {
  if (pairs.length === 1) return pairs[0];

  let bestPair = pairs[0];
  let bestScore = -Infinity;

  for (const pair of pairs) {
    const score = countSharedAncestors(pair, allNeeded, mountMap);
    if (score > bestScore) {
      bestScore = score;
      bestPair = pair;
    }
  }
  return bestPair;
}

export function buildStrategy(
  targetIds: string[],
  allMounts: MountSpecies[],
  allowCloning = false,
  mode: StrategyMode = 'simple',
): BreedingStrategy {
  const mountMap = new Map(allMounts.map((m) => [m.id, m]));

  // Phase 1: collect the universe of all potentially-needed mounts by
  // exploring every parent pair option (not just parents[0]).
  const universe = new Set<string>();
  const uStack = [...targetIds];
  while (uStack.length) {
    const id = uStack.pop()!;
    if (universe.has(id)) continue;
    universe.add(id);
    const mount = mountMap.get(id);
    if (mount && mount.generation > 1 && mount.parents?.length) {
      for (const pair of mount.parents) uStack.push(...pair);
    }
  }

  // Phase 2: determine allNeeded and chosen pairs.
  // Simple: greedily pick the best pair per mount (minimises new captures).
  // Complex: use the full universe (all pairs will be used, production distributed).
  let allNeeded: Set<string>;
  const chosenPairs = new Map<string, [string, string]>();

  if (mode === 'complex') {
    allNeeded = new Set(universe);
  } else {
    allNeeded = new Set<string>(targetIds);

    const sortedUniverse = [...universe].sort(
      (a, b) => (mountMap.get(b)?.generation ?? 0) - (mountMap.get(a)?.generation ?? 0),
    );

    for (const id of sortedUniverse) {
      if (!allNeeded.has(id)) continue;
      const mount = mountMap.get(id);
      if (!mount || mount.generation <= 1 || !mount.parents?.length) continue;

      const pair = chooseBestPair(mount.parents, allNeeded, mountMap);
      chosenPairs.set(id, pair);
      allNeeded.add(pair[0]);
      allNeeded.add(pair[1]);
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
  const parentDemand = new Map<string, number>();
  const productionCounts = new Map<string, number>();

  const sortedNeeded = [...allNeeded].sort(
    (a, b) => (mountMap.get(b)?.generation ?? 0) - (mountMap.get(a)?.generation ?? 0),
  );

  for (const id of sortedNeeded) {
    const tc = targetCounts.get(id) ?? 0;
    const pd = parentDemand.get(id) ?? 0;
    const prod = Math.max(0, Math.max(tc, pd));

    // With cloning: for every 3 copies needed, only 2 must be bred.
    const breedProd = allowCloning ? prod - Math.floor(prod / 3) : prod;

    productionCounts.set(id, prod);

    const mount = mountMap.get(id);
    if (!mount || mount.generation <= 1 || !mount.parents?.length) continue;

    if (mode === 'complex' && mount.parents.length > 1) {
      // Distribute production evenly across all parent pairs.
      const N = mount.parents.length;
      const base = Math.floor(breedProd / N);
      const extra = breedProd % N;
      for (let i = 0; i < N; i++) {
        const contribution = base + (i < extra ? 1 : 0);
        const [a, b] = mount.parents[i];
        parentDemand.set(a, (parentDemand.get(a) ?? 0) + contribution);
        parentDemand.set(b, (parentDemand.get(b) ?? 0) + contribution);
      }
    } else {
      const [a, b] = chosenPairs.get(id) ?? mount.parents[0];
      parentDemand.set(a, (parentDemand.get(a) ?? 0) + breedProd);
      parentDemand.set(b, (parentDemand.get(b) ?? 0) + breedProd);
    }
  }

  // Build output
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

    if (!byGen.has(mount.generation)) byGen.set(mount.generation, []);

    if (mode === 'complex' && mount.parents.length > 1) {
      // Emit one BreedingBreed per pair with its distributed count.
      const N = mount.parents.length;
      const base = Math.floor(prod / N);
      const extra = prod % N;
      for (let i = 0; i < N; i++) {
        const pairCount = base + (i < extra ? 1 : 0);
        if (pairCount <= 0) continue;
        const [aId, bId] = mount.parents[i];
        const parentA = mountMap.get(aId);
        const parentB = mountMap.get(bId);
        if (!parentA || !parentB) continue;
        byGen.get(mount.generation)!.push({ mount, parents: [parentA, parentB], count: pairCount, alternativePairsCount: 0 });
      }
    } else {
      const [aId, bId] = chosenPairs.get(mountId) ?? mount.parents[0];
      const parentA = mountMap.get(aId);
      const parentB = mountMap.get(bId);
      if (!parentA || !parentB) continue;
      byGen.get(mount.generation)!.push({
        mount, parents: [parentA, parentB], count: prod,
        alternativePairsCount: (mount.parents?.length ?? 1) - 1,
      });
    }
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
  mode: StrategyMode = 'simple',
): BreedingStrategy {
  const breedableMounts = allMounts.filter((m) => m.generation > 0);

  if (achievementId === 'meta') {
    return buildStrategy(breedableMounts.map((m) => m.id), allMounts, allowCloning, mode);
  }

  const gen = parseInt(achievementId.replace('gen_', ''), 10);
  if (isNaN(gen)) return { targets: [], captures: [], totalCaptures: 0, steps: [], totalBreeds: 0 };

  if (gen === 1) {
    const gen1 = breedableMounts.filter((m) => m.generation === 1);
    return {
      targets: gen1,
      captures: gen1.map((m) => ({ mount: m, count: 1 })),
      totalCaptures: gen1.length,
      steps: [],
      totalBreeds: 0,
    };
  }

  const targetIds = breedableMounts.filter((m) => m.generation === gen).map((m) => m.id);
  return buildStrategy(targetIds, allMounts, allowCloning, mode);
}
