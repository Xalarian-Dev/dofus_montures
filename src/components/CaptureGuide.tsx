'use client';

import { MountSpecies } from '@/types/mount';

interface CaptureGuideProps {
  mounts: MountSpecies[];
}

export function CaptureGuide({ mounts }: CaptureGuideProps) {
  // Only show generation 1 mounts (wild mounts)
  const wildMounts = mounts.filter((m) => m.generation === 1);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Pour démarrer votre élevage, vous aurez besoin d&apos;obtenir ces montures de base :
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {wildMounts.map((mount) => (
          <div 
            key={mount.id} 
            className="flex items-center justify-between p-3 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
          >
            <span className="font-medium">{mount.name}</span>
            <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full font-semibold">
              Génération 1
            </span>
          </div>
        ))}
      </div>
      
      {wildMounts.length === 0 && (
        <p className="text-sm text-amber-600 dark:text-amber-500 italic">
          Aucune monture de base trouvée pour cette catégorie.
        </p>
      )}
    </div>
  );
}
