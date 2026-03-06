import { MountSpecies } from '@/types/mount';

export const volkornes: MountSpecies[] = [
  // Génération 1
  { id: 'volkorne_ebene', name: 'Volkorne Ebène', category: 'volkornes', generation: 1 },
  { id: 'volkorne_indigo', name: 'Volkorne Indigo', category: 'volkornes', generation: 1 },
  { id: 'volkorne_orchidee', name: 'Volkorne Orchidée', category: 'volkornes', generation: 1 },
  { id: 'volkorne_pourpre', name: 'Volkorne Pourpre', category: 'volkornes', generation: 1 },

  // Génération 2 (Bicolores G1)
  { id: 'volkorne_ebene_indigo', name: 'Volkorne Ebène-Indigo', category: 'volkornes', generation: 2, parents: ['volkorne_ebene', 'volkorne_indigo'] },
  { id: 'volkorne_ebene_orchidee', name: 'Volkorne Ebène-Orchidée', category: 'volkornes', generation: 2, parents: ['volkorne_ebene', 'volkorne_orchidee'] },
  { id: 'volkorne_ebene_pourpre', name: 'Volkorne Ebène-Pourpre', category: 'volkornes', generation: 2, parents: ['volkorne_ebene', 'volkorne_pourpre'] },
  { id: 'volkorne_indigo_orchidee', name: 'Volkorne Indigo-Orchidée', category: 'volkornes', generation: 2, parents: ['volkorne_indigo', 'volkorne_orchidee'] },
  { id: 'volkorne_indigo_pourpre', name: 'Volkorne Indigo-Pourpre', category: 'volkornes', generation: 2, parents: ['volkorne_indigo', 'volkorne_pourpre'] },
  { id: 'volkorne_orchidee_pourpre', name: 'Volkorne Orchidée-Pourpre', category: 'volkornes', generation: 2, parents: ['volkorne_orchidee', 'volkorne_pourpre'] },

  // Génération 3
  { id: 'volkorne_emeraude', name: 'Volkorne Emeraude', category: 'volkornes', generation: 3, parents: ['volkorne_ebene_indigo', 'volkorne_orchidee_pourpre'] },
  { id: 'volkorne_rousse', name: 'Volkorne Roux', category: 'volkornes', generation: 3, parents: ['volkorne_ebene_orchidee', 'volkorne_indigo_pourpre'] },

  // Génération 4 (Émeraude & Roux Bicolores)
  { id: 'volkorne_ebene_emeraude', name: 'Volkorne Ebène-Emeraude', category: 'volkornes', generation: 4, parents: ['volkorne_ebene', 'volkorne_emeraude'] },
  { id: 'volkorne_indigo_emeraude', name: 'Volkorne Indigo-Emeraude', category: 'volkornes', generation: 4, parents: ['volkorne_indigo', 'volkorne_emeraude'] },
  { id: 'volkorne_orchidee_emeraude', name: 'Volkorne Orchidée-Emeraude', category: 'volkornes', generation: 4, parents: ['volkorne_orchidee', 'volkorne_emeraude'] },
  { id: 'volkorne_pourpre_emeraude', name: 'Volkorne Pourpre-Emeraude', category: 'volkornes', generation: 4, parents: ['volkorne_pourpre', 'volkorne_emeraude'] },
  
  { id: 'volkorne_ebene_rousse', name: 'Volkorne Ebène-Roux', category: 'volkornes', generation: 4, parents: ['volkorne_ebene', 'volkorne_rousse'] },
  { id: 'volkorne_indigo_rousse', name: 'Volkorne Indigo-Roux', category: 'volkornes', generation: 4, parents: ['volkorne_indigo', 'volkorne_rousse'] },
  { id: 'volkorne_orchidee_rousse', name: 'Volkorne Orchidée-Roux', category: 'volkornes', generation: 4, parents: ['volkorne_orchidee', 'volkorne_rousse'] },
  { id: 'volkorne_pourpre_rousse', name: 'Volkorne Pourpre-Roux', category: 'volkornes', generation: 4, parents: ['volkorne_pourpre', 'volkorne_rousse'] },

  { id: 'volkorne_emeraude_rousse', name: 'Volkorne Emeraude-Roux', category: 'volkornes', generation: 4, parents: ['volkorne_emeraude', 'volkorne_rousse'] },

  // Génération 5
  { id: 'volkorne_amande', name: 'Volkorne Amande', category: 'volkornes', generation: 5, parents: ['volkorne_emeraude_rousse', 'volkorne_ebene_indigo'] },
  { id: 'volkorne_prune', name: 'Volkorne Prune', category: 'volkornes', generation: 5, parents: ['volkorne_indigo_emeraude', 'volkorne_orchidee_rousse'] },

  // Génération 6 (Amande & Prune Bicolores)
  { id: 'volkorne_amande_prune', name: 'Volkorne Amande-Prune', category: 'volkornes', generation: 6, parents: ['volkorne_amande', 'volkorne_prune'] },
  { id: 'volkorne_amande_emeraude', name: 'Volkorne Amande-Emeraude', category: 'volkornes', generation: 6, parents: ['volkorne_amande', 'volkorne_emeraude'] },
  { id: 'volkorne_prune_rousse', name: 'Volkorne Prune-Roux', category: 'volkornes', generation: 6, parents: ['volkorne_prune', 'volkorne_rousse'] },

  // Génération 7
  { id: 'volkorne_doree', name: 'Volkorne Doré', category: 'volkornes', generation: 7, parents: ['volkorne_amande_prune', 'volkorne_ebene_rousse'] },
  { id: 'volkorne_ivoire', name: 'Volkorne Ivoire', category: 'volkornes', generation: 7, parents: ['volkorne_amande_emeraude', 'volkorne_prune_rousse'] },

  // Génération 8 (Doré & Ivoire Bicolores)
  { id: 'volkorne_doree_ivoire', name: 'Volkorne Doré-Ivoire', category: 'volkornes', generation: 8, parents: ['volkorne_doree', 'volkorne_ivoire'] },
  { id: 'volkorne_doree_amande', name: 'Volkorne Doré-Amande', category: 'volkornes', generation: 8, parents: ['volkorne_doree', 'volkorne_amande'] },
  { id: 'volkorne_ivoire_prune', name: 'Volkorne Ivoire-Prune', category: 'volkornes', generation: 8, parents: ['volkorne_ivoire', 'volkorne_prune'] },

  // Génération 9
  { id: 'volkorne_jade', name: 'Volkorne Jade', category: 'volkornes', generation: 9, parents: ['volkorne_doree_ivoire', 'volkorne_amande_prune'] },

  // Génération 10
  { id: 'volkorne_jade_doree', name: 'Volkorne Jade-Doré', category: 'volkornes', generation: 10, parents: ['volkorne_jade', 'volkorne_doree'] },
  { id: 'volkorne_jade_ivoire', name: 'Volkorne Jade-Ivoire', category: 'volkornes', generation: 10, parents: ['volkorne_jade', 'volkorne_ivoire'] },
];
