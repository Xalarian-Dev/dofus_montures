'use client';

import { useBreedingStore } from '@/store/useBreedingStore';
import { MountSpecies } from '@/types/mount';
import { Minus, Plus } from 'lucide-react';

interface MountInventoryItemProps {
  mount: MountSpecies;
}

export function MountInventoryItem({ mount }: MountInventoryItemProps) {
  const inventory = useBreedingStore((state) => state.inventory);
  const setMaleCount = useBreedingStore((state) => state.setMaleCount);
  const setFemaleCount = useBreedingStore((state) => state.setFemaleCount);
  const incrementMale = useBreedingStore((state) => state.incrementMale);
  const decrementMale = useBreedingStore((state) => state.decrementMale);
  const incrementFemale = useBreedingStore((state) => state.incrementFemale);
  const decrementFemale = useBreedingStore((state) => state.decrementFemale);

  const mountData = inventory[mount.id] || { maleCount: 0, femaleCount: 0 };

  const handleMaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 0;
    setMaleCount(mount.id, val);
  };

  const handleFemaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 0;
    setFemaleCount(mount.id, val);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 gap-4">
      <div className="flex-1">
        <h3 className="font-medium">{mount.name}</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Génération {mount.generation}</p>
      </div>
      
      <div className="flex items-center gap-6">
        {/* Males */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Mâles</span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => decrementMale(mount.id)}
              className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-500"
            >
              <Minus size={16} />
            </button>
            <input 
              type="number" 
              min="0"
              value={mountData.maleCount}
              onChange={handleMaleChange}
              className="w-12 text-center bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md py-1 text-sm no-spinners"
            />
            <button 
              onClick={() => incrementMale(mount.id)}
              className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-500"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Females */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-semibold text-pink-600 dark:text-pink-400">Femelles</span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => decrementFemale(mount.id)}
              className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-500"
            >
              <Minus size={16} />
            </button>
            <input 
              type="number" 
              min="0"
              value={mountData.femaleCount}
              onChange={handleFemaleChange}
              className="w-12 text-center bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md py-1 text-sm no-spinners"
            />
            <button 
              onClick={() => incrementFemale(mount.id)}
              className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-500"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
