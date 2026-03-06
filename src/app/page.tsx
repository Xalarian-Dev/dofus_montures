import Link from "next/link";
import { ArrowRight, Leaf, Shield, Flame } from "lucide-react";

export default function Home() {
  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col min-h-full items-center justify-center py-20">
      
      <div className="text-center mb-16 max-w-2xl">
        <h1 className="text-5xl font-extrabold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
          Dofus Tracker d&apos;Élevage
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400">
          Optimisez votre élevage et débloquez toutes les générations. Suivez efficacement vos captures et accouplements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        
        {/* Dragodindes Card */}
        <Link href="/dragodindes" className="group relative flex flex-col p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all hover:shadow-xl hover:shadow-emerald-500/10 overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10 flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Leaf size={28} />
            </div>
            <ArrowRight className="text-zinc-300 dark:text-zinc-700 group-hover:text-emerald-500 transition-colors" />
          </div>
          <h2 className="relative z-10 text-2xl font-bold mb-2">Dragodindes</h2>
          <p className="relative z-10 text-zinc-500 dark:text-zinc-400 text-sm">
            Montures terrestres de base. Arbre généalogique complet avec croisements classiques.
          </p>
        </Link>

        {/* Muldos Card */}
        <Link href="/muldos" className="group relative flex flex-col p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all hover:shadow-xl hover:shadow-blue-500/10 overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10 flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl">
              <Shield size={28} />
            </div>
            <ArrowRight className="text-zinc-300 dark:text-zinc-700 group-hover:text-blue-500 transition-colors" />
          </div>
          <h2 className="relative z-10 text-2xl font-bold mb-2">Muldos</h2>
          <p className="relative z-10 text-zinc-500 dark:text-zinc-400 text-sm">
            Montures aquatiques. Gestion des croisements spécifiques et capacités de nage.
          </p>
        </Link>

        {/* Volkornes Card */}
        <Link href="/volkornes" className="group relative flex flex-col p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/50 dark:hover:border-amber-500/50 transition-all hover:shadow-xl hover:shadow-amber-500/10 overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-amber-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10 flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-xl">
              <Flame size={28} />
            </div>
            <ArrowRight className="text-zinc-300 dark:text-zinc-700 group-hover:text-amber-500 transition-colors" />
          </div>
          <h2 className="relative z-10 text-2xl font-bold mb-2">Volkornes</h2>
          <p className="relative z-10 text-zinc-500 dark:text-zinc-400 text-sm">
            Montures divines. Système génétique complexe et mutations rares.
          </p>
        </Link>
        
      </div>
    </div>
  );
}
