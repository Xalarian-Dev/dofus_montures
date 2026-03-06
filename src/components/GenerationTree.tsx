'use client';

import { MountSpecies } from '@/types/mount';
import { useBreedingStore } from '@/store/useBreedingStore';
import { CheckCircle2, Circle } from 'lucide-react';

interface GenerationTreeProps {
  mounts: MountSpecies[];
}

export function GenerationTree({ mounts }: GenerationTreeProps) {
  const inventory = useBreedingStore((state) => state.inventory);

  // Group mounts by generation
  const generations = mounts.reduce((acc, mount) => {
    if (!acc[mount.generation]) {
      acc[mount.generation] = [];
    }
    acc[mount.generation].push(mount);
    return acc;
  }, {} as Record<number, MountSpecies[]>);

  const maxGeneration = Math.max(...Object.keys(generations).map(Number));

  // Helper to check if a user has at least one male and female to continue breeding
  const hasBreedingPair = (mountId: string) => {
    const data = inventory[mountId];
    return data && data.maleCount > 0 && data.femaleCount > 0;
  };

  // Helper to get mount name
  const getMountName = (id: string) => mounts.find(m => m.id === id)?.name || id;

  return (
    <div className="flex flex-col gap-8">
      {Array.from({ length: maxGeneration }, (_, i) => i + 1).map((gen) => (
        <div key={`gen-${gen}`} className="flex flex-col gap-4">
          <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-2">
            <h3 className="text-xl font-bold">Génération {gen}</h3>
            {gen === 1 && (
              <span className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-md">
                Montures de base
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {generations[gen]?.map((mount) => {
              const hasPair = hasBreedingPair(mount.id);
              
              return (
                <div 
                  key={mount.id} 
                  className={`flex flex-col p-4 rounded-lg border transition-colors ${
                    hasPair 
                      ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/50' 
                      : 'bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="font-semibold">{mount.name}</span>
                    {hasPair ? (
                      <CheckCircle2 className="text-emerald-500" size={20} />
                    ) : (
                      <Circle className="text-zinc-300 dark:text-zinc-700" size={20} />
                    )}
                  </div>

                  {mount.parents && mount.parents.length === 2 ? (
                    <div className="text-sm flex flex-col gap-1 mt-auto">
                      <span className="text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider font-semibold">
                        Parents requis
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-xs truncate max-w-[120px]" title={getMountName(mount.parents[0])}>
                          {getMountName(mount.parents[0])}
                        </span>
                        <span className="text-zinc-400">+</span>
                        <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-xs truncate max-w-[120px]" title={getMountName(mount.parents[1])}>
                          {getMountName(mount.parents[1])}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-auto italic">
                      Obtention initiale / Achat
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
