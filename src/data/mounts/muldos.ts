import { MountSpecies } from '@/types/mount';

export const muldos: MountSpecies[] = [
  // Génération 1
  { id: 'muldo_dore', name: 'Muldo Doré', category: 'muldos', generation: 1 },
  { id: 'muldo_ebene', name: 'Muldo Ebène', category: 'muldos', generation: 1 },
  { id: 'muldo_indigo', name: 'Muldo Indigo', category: 'muldos', generation: 1 },
  { id: 'muldo_orchidee', name: 'Muldo Orchidée', category: 'muldos', generation: 1 },
  { id: 'muldo_pourpre', name: 'Muldo Pourpre', category: 'muldos', generation: 1 },

  // Génération 2 (Bicolores G1)
  { id: 'muldo_dore_ebene', name: 'Muldo Doré-Ebène', category: 'muldos', generation: 2, parents: ['muldo_dore', 'muldo_ebene'] },
  { id: 'muldo_dore_indigo', name: 'Muldo Doré-Indigo', category: 'muldos', generation: 2, parents: ['muldo_dore', 'muldo_indigo'] },
  { id: 'muldo_dore_orchidee', name: 'Muldo Doré-Orchidée', category: 'muldos', generation: 2, parents: ['muldo_dore', 'muldo_orchidee'] },
  { id: 'muldo_dore_pourpre', name: 'Muldo Doré-Pourpre', category: 'muldos', generation: 2, parents: ['muldo_dore', 'muldo_pourpre'] },
  { id: 'muldo_ebene_indigo', name: 'Muldo Ebène-Indigo', category: 'muldos', generation: 2, parents: ['muldo_ebene', 'muldo_indigo'] },
  { id: 'muldo_ebene_orchidee', name: 'Muldo Ebène-Orchidée', category: 'muldos', generation: 2, parents: ['muldo_ebene', 'muldo_orchidee'] },
  { id: 'muldo_ebene_pourpre', name: 'Muldo Ebène-Pourpre', category: 'muldos', generation: 2, parents: ['muldo_ebene', 'muldo_pourpre'] },
  { id: 'muldo_indigo_orchidee', name: 'Muldo Indigo-Orchidée', category: 'muldos', generation: 2, parents: ['muldo_indigo', 'muldo_orchidee'] },
  { id: 'muldo_indigo_pourpre', name: 'Muldo Indigo-Pourpre', category: 'muldos', generation: 2, parents: ['muldo_indigo', 'muldo_pourpre'] },
  { id: 'muldo_orchidee_pourpre', name: 'Muldo Orchidée-Pourpre', category: 'muldos', generation: 2, parents: ['muldo_orchidee', 'muldo_pourpre'] },

  // Génération 3
  { id: 'muldo_amande', name: 'Muldo Amande', category: 'muldos', generation: 3, parents: ['muldo_dore_ebene', 'muldo_indigo_orchidee'] },
  { id: 'muldo_roux', name: 'Muldo Roux', category: 'muldos', generation: 3, parents: ['muldo_dore_indigo', 'muldo_ebene_pourpre'] },

  // Génération 4 (Amande & Roux Bicolores)
  { id: 'muldo_amande_dore', name: 'Muldo Amande-Doré', category: 'muldos', generation: 4, parents: ['muldo_amande', 'muldo_dore'] },
  { id: 'muldo_amande_ebene', name: 'Muldo Amande-Ebène', category: 'muldos', generation: 4, parents: ['muldo_amande', 'muldo_ebene'] },
  { id: 'muldo_amande_indigo', name: 'Muldo Amande-Indigo', category: 'muldos', generation: 4, parents: ['muldo_amande', 'muldo_indigo'] },
  { id: 'muldo_amande_orchidee', name: 'Muldo Amande-Orchidée', category: 'muldos', generation: 4, parents: ['muldo_amande', 'muldo_orchidee'] },
  { id: 'muldo_amande_pourpre', name: 'Muldo Amande-Pourpre', category: 'muldos', generation: 4, parents: ['muldo_amande', 'muldo_pourpre'] },
  
  { id: 'muldo_roux_dore', name: 'Muldo Roux-Doré', category: 'muldos', generation: 4, parents: ['muldo_roux', 'muldo_dore'] },
  { id: 'muldo_roux_ebene', name: 'Muldo Roux-Ebène', category: 'muldos', generation: 4, parents: ['muldo_roux', 'muldo_ebene'] },
  { id: 'muldo_roux_indigo', name: 'Muldo Roux-Indigo', category: 'muldos', generation: 4, parents: ['muldo_roux', 'muldo_indigo'] },
  { id: 'muldo_roux_orchidee', name: 'Muldo Roux-Orchidée', category: 'muldos', generation: 4, parents: ['muldo_roux', 'muldo_orchidee'] },
  { id: 'muldo_roux_pourpre', name: 'Muldo Roux-Pourpre', category: 'muldos', generation: 4, parents: ['muldo_roux', 'muldo_pourpre'] },

  { id: 'muldo_amande_roux', name: 'Muldo Amande-Roux', category: 'muldos', generation: 4, parents: ['muldo_amande', 'muldo_roux'] },

  // Génération 5
  { id: 'muldo_ivoire', name: 'Muldo Ivoire', category: 'muldos', generation: 5, parents: ['muldo_amande_roux', 'muldo_dore_ebene'] },
  { id: 'muldo_turquoise', name: 'Muldo Turquoise', category: 'muldos', generation: 5, parents: ['muldo_amande_pourpre', 'muldo_roux_orchidee'] },

  // Génération 6 (Ivoire & Turquoise Bicolores - simplifié)
  { id: 'muldo_ivoire_turquoise', name: 'Muldo Ivoire-Turquoise', category: 'muldos', generation: 6, parents: ['muldo_ivoire', 'muldo_turquoise'] },
  { id: 'muldo_ivoire_amande', name: 'Muldo Ivoire-Amande', category: 'muldos', generation: 6, parents: ['muldo_ivoire', 'muldo_amande'] },
  { id: 'muldo_turquoise_roux', name: 'Muldo Turquoise-Roux', category: 'muldos', generation: 6, parents: ['muldo_turquoise', 'muldo_roux'] },

  // Génération 7
  { id: 'muldo_emeraude', name: 'Muldo Emeraude', category: 'muldos', generation: 7, parents: ['muldo_ivoire_turquoise', 'muldo_amande_dore'] },
  { id: 'muldo_prune', name: 'Muldo Prune', category: 'muldos', generation: 7, parents: ['muldo_ivoire_amande', 'muldo_turquoise_roux'] },

  // Génération 8 (Émeraude & Prune Bicolores - simplifié)
  { id: 'muldo_emeraude_prune', name: 'Muldo Emeraude-Prune', category: 'muldos', generation: 8, parents: ['muldo_emeraude', 'muldo_prune'] },
  { id: 'muldo_emeraude_ivoire', name: 'Muldo Emeraude-Ivoire', category: 'muldos', generation: 8, parents: ['muldo_emeraude', 'muldo_ivoire'] },
  { id: 'muldo_prune_turquoise', name: 'Muldo Prune-Turquoise', category: 'muldos', generation: 8, parents: ['muldo_prune', 'muldo_turquoise'] },

  // Génération 9
  { id: 'muldo_cramoisi', name: 'Muldo Cramoisi', category: 'muldos', generation: 9, parents: ['muldo_emeraude_prune', 'muldo_ivoire_turquoise'] },

  // Génération 10
  { id: 'muldo_cramoisi_emeraude', name: 'Muldo Cramoisi-Emeraude', category: 'muldos', generation: 10, parents: ['muldo_cramoisi', 'muldo_emeraude'] },
  { id: 'muldo_cramoisi_prune', name: 'Muldo Cramoisi-Prune', category: 'muldos', generation: 10, parents: ['muldo_cramoisi', 'muldo_prune'] },
];
