'use client';

import { muldos } from '@/data/mounts/muldos';
import { CaptureGuide } from '@/components/CaptureGuide';
import { GenerationTree } from '@/components/GenerationTree';
import { MountInventoryItem } from '@/components/MountInventoryItem';

export default function MuldosPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Élevage de Muldos</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Gérez votre élevage de Muldos : captures, accouplements, et inventaire.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
         <div className="flex flex-col gap-4">
           <h2 className="text-xl font-semibold border-b border-zinc-200 dark:border-zinc-800 pb-2">
             1. Captures Requises
           </h2>
           <CaptureGuide mounts={muldos} />
         </div>
         
         <div className="flex flex-col gap-4">
           <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
             <h2 className="text-xl font-semibold">2. Mon Inventaire</h2>
             <span className="text-xs text-zinc-500">Mettez à jour vos montures</span>
           </div>
           <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
             {muldos.map((mount) => (
               <MountInventoryItem key={`inv-${mount.id}`} mount={mount} />
             ))}
           </div>
         </div>
      </div>
      
      <div className="flex flex-col gap-4 mt-12 bg-white dark:bg-zinc-900/40 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
         <div className="mb-2">
           <h2 className="text-2xl font-semibold">3. Arbre Généalogique</h2>
           <p className="text-sm text-zinc-500 mt-1">
             Suivez cet ordre pour débloquer toutes les générations. La case devient verte lorsque vous possédez au moins 1 mâle et 1 femelle.
           </p>
         </div>
         <GenerationTree mounts={muldos} />
      </div>
    </div>
  );
}
