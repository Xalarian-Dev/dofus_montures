'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils'; // Assuming standard shadcn/ui like utils exist

export function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Accueil' },
    { href: '/dragodindes', label: 'Dragodindes' },
    { href: '/muldos', label: 'Muldos' },
    { href: '/volkornes', label: 'Volkornes' },
  ];

  return (
    <nav className="flex flex-col w-64 border-r bg-zinc-50 dark:bg-zinc-900 min-h-screen p-4 gap-2">
      <div className="mb-8 px-2">
        <h1 className="text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
          Élevage Dofus
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Tracker de progression</p>
      </div>
      
      <div className="flex flex-col gap-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "px-3 py-2 rounded-md text-sm font-medium transition-colors",
              pathname === link.href 
                ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50" 
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-50"
            )}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
