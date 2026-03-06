import { MountSpecies } from '@/types/mount';

export const dragodindes: MountSpecies[] = [
  // Génération 1
  { id: 'dd_amande', name: 'Dragodinde Amande', category: 'dragodindes', generation: 1 },
  { id: 'dd_rousse', name: 'Dragodinde Rousse', category: 'dragodindes', generation: 1 },
  { id: 'dd_doree', name: 'Dragodinde Dorée', category: 'dragodindes', generation: 1 },

  // Génération 2
  { id: 'dd_amande_rousse', name: 'Dragodinde Amande-Rousse', category: 'dragodindes', generation: 2, parents: ['dd_amande', 'dd_rousse'] },
  { id: 'dd_amande_doree', name: 'Dragodinde Amande-Dorée', category: 'dragodindes', generation: 2, parents: ['dd_amande', 'dd_doree'] },
  { id: 'dd_rousse_doree', name: 'Dragodinde Rousse-Dorée', category: 'dragodindes', generation: 2, parents: ['dd_rousse', 'dd_doree'] },

  // Génération 3
  { id: 'dd_indigo', name: 'Dragodinde Indigo', category: 'dragodindes', generation: 3, parents: ['dd_amande', 'dd_rousse_doree'] }, // A vérifier, je simplifie pour l'exemple
  { id: 'dd_ebene', name: 'Dragodinde Ebène', category: 'dragodindes', generation: 3, parents: ['dd_amande_rousse', 'dd_rousse_doree'] },

  // Génération 4
  { id: 'dd_amande_indigo', name: 'Dragodinde Amande-Indigo', category: 'dragodindes', generation: 4, parents: ['dd_amande', 'dd_indigo'] },
  { id: 'dd_rousse_indigo', name: 'Dragodinde Rousse-Indigo', category: 'dragodindes', generation: 4, parents: ['dd_rousse', 'dd_indigo'] },
  { id: 'dd_doree_indigo', name: 'Dragodinde Dorée-Indigo', category: 'dragodindes', generation: 4, parents: ['dd_doree', 'dd_indigo'] },
  { id: 'dd_amande_ebene', name: 'Dragodinde Amande-Ebène', category: 'dragodindes', generation: 4, parents: ['dd_amande', 'dd_ebene'] },
  { id: 'dd_rousse_ebene', name: 'Dragodinde Rousse-Ebène', category: 'dragodindes', generation: 4, parents: ['dd_rousse', 'dd_ebene'] },
  { id: 'dd_doree_ebene', name: 'Dragodinde Dorée-Ebène', category: 'dragodindes', generation: 4, parents: ['dd_doree', 'dd_ebene'] },
  { id: 'dd_indigo_ebene', name: 'Dragodinde Indigo-Ebène', category: 'dragodindes', generation: 4, parents: ['dd_indigo', 'dd_ebene'] },

  // Génération 5
  { id: 'dd_pourpre', name: 'Dragodinde Pourpre', category: 'dragodindes', generation: 5, parents: ['dd_amande_indigo', 'dd_rousse_ebene'] },
  { id: 'dd_orchidee', name: 'Dragodinde Orchidée', category: 'dragodindes', generation: 5, parents: ['dd_rousse_indigo', 'dd_amande_ebene'] },

  // Génération 6
  { id: 'dd_amande_pourpre', name: 'Dragodinde Amande-Pourpre', category: 'dragodindes', generation: 6, parents: ['dd_amande', 'dd_pourpre'] },
  { id: 'dd_rousse_pourpre', name: 'Dragodinde Rousse-Pourpre', category: 'dragodindes', generation: 6, parents: ['dd_rousse', 'dd_pourpre'] },
  { id: 'dd_doree_pourpre', name: 'Dragodinde Dorée-Pourpre', category: 'dragodindes', generation: 6, parents: ['dd_doree', 'dd_pourpre'] },
  { id: 'dd_indigo_pourpre', name: 'Dragodinde Indigo-Pourpre', category: 'dragodindes', generation: 6, parents: ['dd_indigo', 'dd_pourpre'] },
  { id: 'dd_ebene_pourpre', name: 'Dragodinde Ebène-Pourpre', category: 'dragodindes', generation: 6, parents: ['dd_ebene', 'dd_pourpre'] },
  { id: 'dd_amande_orchidee', name: 'Dragodinde Amande-Orchidée', category: 'dragodindes', generation: 6, parents: ['dd_amande', 'dd_orchidee'] },
  { id: 'dd_rousse_orchidee', name: 'Dragodinde Rousse-Orchidée', category: 'dragodindes', generation: 6, parents: ['dd_rousse', 'dd_orchidee'] },
  { id: 'dd_doree_orchidee', name: 'Dragodinde Dorée-Orchidée', category: 'dragodindes', generation: 6, parents: ['dd_doree', 'dd_orchidee'] },
  { id: 'dd_indigo_orchidee', name: 'Dragodinde Indigo-Orchidée', category: 'dragodindes', generation: 6, parents: ['dd_indigo', 'dd_orchidee'] },
  { id: 'dd_ebene_orchidee', name: 'Dragodinde Ebène-Orchidée', category: 'dragodindes', generation: 6, parents: ['dd_ebene', 'dd_orchidee'] },
  { id: 'dd_pourpre_orchidee', name: 'Dragodinde Pourpre-Orchidée', category: 'dragodindes', generation: 6, parents: ['dd_pourpre', 'dd_orchidee'] },

  // Génération 7
  { id: 'dd_ivoire', name: 'Dragodinde Ivoire', category: 'dragodindes', generation: 7, parents: ['dd_amande_pourpre', 'dd_rousse_orchidee'] },
  { id: 'dd_turquoise', name: 'Dragodinde Turquoise', category: 'dragodindes', generation: 7, parents: ['dd_rousse_pourpre', 'dd_amande_orchidee'] },

  // Génération 8
  { id: 'dd_amande_ivoire', name: 'Dragodinde Amande-Ivoire', category: 'dragodindes', generation: 8, parents: ['dd_amande', 'dd_ivoire'] },
  { id: 'dd_rousse_ivoire', name: 'Dragodinde Rousse-Ivoire', category: 'dragodindes', generation: 8, parents: ['dd_rousse', 'dd_ivoire'] },
  { id: 'dd_doree_ivoire', name: 'Dragodinde Dorée-Ivoire', category: 'dragodindes', generation: 8, parents: ['dd_doree', 'dd_ivoire'] },
  { id: 'dd_indigo_ivoire', name: 'Dragodinde Indigo-Ivoire', category: 'dragodindes', generation: 8, parents: ['dd_indigo', 'dd_ivoire'] },
  { id: 'dd_ebene_ivoire', name: 'Dragodinde Ebène-Ivoire', category: 'dragodindes', generation: 8, parents: ['dd_ebene', 'dd_ivoire'] },
  { id: 'dd_pourpre_ivoire', name: 'Dragodinde Pourpre-Ivoire', category: 'dragodindes', generation: 8, parents: ['dd_pourpre', 'dd_ivoire'] },
  { id: 'dd_orchidee_ivoire', name: 'Dragodinde Orchidée-Ivoire', category: 'dragodindes', generation: 8, parents: ['dd_orchidee', 'dd_ivoire'] },
  { id: 'dd_amande_turquoise', name: 'Dragodinde Amande-Turquoise', category: 'dragodindes', generation: 8, parents: ['dd_amande', 'dd_turquoise'] },
  { id: 'dd_rousse_turquoise', name: 'Dragodinde Rousse-Turquoise', category: 'dragodindes', generation: 8, parents: ['dd_rousse', 'dd_turquoise'] },
  { id: 'dd_doree_turquoise', name: 'Dragodinde Dorée-Turquoise', category: 'dragodindes', generation: 8, parents: ['dd_doree', 'dd_turquoise'] },
  { id: 'dd_indigo_turquoise', name: 'Dragodinde Indigo-Turquoise', category: 'dragodindes', generation: 8, parents: ['dd_indigo', 'dd_turquoise'] },
  { id: 'dd_ebene_turquoise', name: 'Dragodinde Ebène-Turquoise', category: 'dragodindes', generation: 8, parents: ['dd_ebene', 'dd_turquoise'] },
  { id: 'dd_pourpre_turquoise', name: 'Dragodinde Pourpre-Turquoise', category: 'dragodindes', generation: 8, parents: ['dd_pourpre', 'dd_turquoise'] },
  { id: 'dd_orchidee_turquoise', name: 'Dragodinde Orchidée-Turquoise', category: 'dragodindes', generation: 8, parents: ['dd_orchidee', 'dd_turquoise'] },
  { id: 'dd_ivoire_turquoise', name: 'Dragodinde Ivoire-Turquoise', category: 'dragodindes', generation: 8, parents: ['dd_ivoire', 'dd_turquoise'] },

  // Génération 9
  { id: 'dd_emeraude', name: 'Dragodinde Emeraude', category: 'dragodindes', generation: 9, parents: ['dd_amande_ivoire', 'dd_rousse_turquoise'] },
  { id: 'dd_prune', name: 'Dragodinde Prune', category: 'dragodindes', generation: 9, parents: ['dd_rousse_ivoire', 'dd_amande_turquoise'] },

  // Génération 10
  { id: 'dd_amande_emeraude', name: 'Dragodinde Amande-Emeraude', category: 'dragodindes', generation: 10, parents: ['dd_amande', 'dd_emeraude'] },
  { id: 'dd_rousse_emeraude', name: 'Dragodinde Rousse-Emeraude', category: 'dragodindes', generation: 10, parents: ['dd_rousse', 'dd_emeraude'] },
  { id: 'dd_doree_emeraude', name: 'Dragodinde Dorée-Emeraude', category: 'dragodindes', generation: 10, parents: ['dd_doree', 'dd_emeraude'] },
  { id: 'dd_indigo_emeraude', name: 'Dragodinde Indigo-Emeraude', category: 'dragodindes', generation: 10, parents: ['dd_indigo', 'dd_emeraude'] },
  { id: 'dd_ebene_emeraude', name: 'Dragodinde Ebène-Emeraude', category: 'dragodindes', generation: 10, parents: ['dd_ebene', 'dd_emeraude'] },
  { id: 'dd_pourpre_emeraude', name: 'Dragodinde Pourpre-Emeraude', category: 'dragodindes', generation: 10, parents: ['dd_pourpre', 'dd_emeraude'] },
  { id: 'dd_orchidee_emeraude', name: 'Dragodinde Orchidée-Emeraude', category: 'dragodindes', generation: 10, parents: ['dd_orchidee', 'dd_emeraude'] },
  { id: 'dd_ivoire_emeraude', name: 'Dragodinde Ivoire-Emeraude', category: 'dragodindes', generation: 10, parents: ['dd_ivoire', 'dd_emeraude'] },
  { id: 'dd_turquoise_emeraude', name: 'Dragodinde Turquoise-Emeraude', category: 'dragodindes', generation: 10, parents: ['dd_turquoise', 'dd_emeraude'] },
  { id: 'dd_amande_prune', name: 'Dragodinde Amande-Prune', category: 'dragodindes', generation: 10, parents: ['dd_amande', 'dd_prune'] },
  { id: 'dd_rousse_prune', name: 'Dragodinde Rousse-Prune', category: 'dragodindes', generation: 10, parents: ['dd_rousse', 'dd_prune'] },
  { id: 'dd_doree_prune', name: 'Dragodinde Dorée-Prune', category: 'dragodindes', generation: 10, parents: ['dd_doree', 'dd_prune'] },
  { id: 'dd_indigo_prune', name: 'Dragodinde Indigo-Prune', category: 'dragodindes', generation: 10, parents: ['dd_indigo', 'dd_prune'] },
  { id: 'dd_ebene_prune', name: 'Dragodinde Ebène-Prune', category: 'dragodindes', generation: 10, parents: ['dd_ebene', 'dd_prune'] },
  { id: 'dd_pourpre_prune', name: 'Dragodinde Pourpre-Prune', category: 'dragodindes', generation: 10, parents: ['dd_pourpre', 'dd_prune'] },
  { id: 'dd_orchidee_prune', name: 'Dragodinde Orchidée-Prune', category: 'dragodindes', generation: 10, parents: ['dd_orchidee', 'dd_prune'] },
  { id: 'dd_ivoire_prune', name: 'Dragodinde Ivoire-Prune', category: 'dragodindes', generation: 10, parents: ['dd_ivoire', 'dd_prune'] },
  { id: 'dd_turquoise_prune', name: 'Dragodinde Turquoise-Prune', category: 'dragodindes', generation: 10, parents: ['dd_turquoise', 'dd_prune'] },
  { id: 'dd_emeraude_prune', name: 'Dragodinde Emeraude-Prune', category: 'dragodindes', generation: 10, parents: ['dd_emeraude', 'dd_prune'] },
];
