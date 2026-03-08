import { MountSpecies } from '@/types/mount';

const BASE_URL = '/assets/sprites/dragodindes';

export const dragodindes: MountSpecies[] = [
  // Génération 1
  { id: 'dd_amande', name: 'Dragodinde Amande', category: 'dragodindes', generation: 1, sprite: `${BASE_URL}/amande.png`, stats: { vitalite: 400, initiative: 1700 } },
  { id: 'dd_rousse', name: 'Dragodinde Rousse', category: 'dragodindes', generation: 1, sprite: `${BASE_URL}/rousse.png`, stats: { vitalite: 400, soins: 60 } },
  { id: 'dd_doree', name: 'Dragodinde Dorée', category: 'dragodindes', generation: 1, sprite: `${BASE_URL}/doree.png`, stats: { vitalite: 400, invocations: 2 } },

  // Génération 2
  { id: 'dd_amande_rousse', name: 'Dragodinde Amande et Rousse', category: 'dragodindes', generation: 2, parents: [['dd_amande', 'dd_rousse']], sprite: `${BASE_URL}/amande-rousse.png`, stats: { vitalite: 400, soins: 60, initiative: 1200 } },
  { id: 'dd_amande_doree', name: 'Dragodinde Amande et Dorée', category: 'dragodindes', generation: 2, parents: [['dd_amande', 'dd_doree']], sprite: `${BASE_URL}/amande-doree.png`, stats: { vitalite: 400, invocations: 1, initiative: 1200 } },
  { id: 'dd_rousse_doree', name: 'Dragodinde Dorée et Rousse', category: 'dragodindes', generation: 2, parents: [['dd_rousse', 'dd_doree']], sprite: `${BASE_URL}/doree-rousse.png`, stats: { vitalite: 400, invocations: 1, soins: 45 } },

  // Génération 3
  { id: 'dd_ebene', name: 'Dragodinde Ebène', category: 'dragodindes', generation: 3, parents: [['dd_amande_doree', 'dd_rousse_doree']], sprite: `${BASE_URL}/ebene.png`, stats: { vitalite: 400, agilite: 120 } },
  { id: 'dd_indigo', name: 'Dragodinde Indigo', category: 'dragodindes', generation: 3, parents: [['dd_amande_doree', 'dd_amande_rousse']], sprite: `${BASE_URL}/indigo.png`, stats: { vitalite: 400, chance: 120 } },

  // Génération 4
  { id: 'dd_rousse_indigo', name: 'Dragodinde Indigo et Rousse', category: 'dragodindes', generation: 4, parents: [['dd_rousse', 'dd_indigo']], sprite: `${BASE_URL}/indigo-rousse.png`, stats: { vitalite: 400, chance: 90, soins: 45 } },
  { id: 'dd_rousse_ebene', name: 'Dragodinde Ebène et Rousse', category: 'dragodindes', generation: 4, parents: [['dd_rousse', 'dd_ebene']], sprite: `${BASE_URL}/ebene-rousse.png`, stats: { vitalite: 400, agilite: 90, soins: 45 } },
  { id: 'dd_amande_indigo', name: 'Dragodinde Amande et Indigo', category: 'dragodindes', generation: 4, parents: [['dd_amande', 'dd_indigo']], sprite: `${BASE_URL}/amande-indigo.png`, stats: { vitalite: 400, chance: 90, initiative: 1200 } },
  { id: 'dd_amande_ebene', name: 'Dragodinde Amande et Ebène', category: 'dragodindes', generation: 4, parents: [['dd_amande', 'dd_ebene']], sprite: `${BASE_URL}/amande-ebene.png`, stats: { vitalite: 400, agilite: 120, initiative: 1200 } },
  { id: 'dd_doree_indigo', name: 'Dragodinde Dorée et Indigo', category: 'dragodindes', generation: 4, parents: [['dd_doree', 'dd_indigo']], sprite: `${BASE_URL}/doree-indigo.png`, stats: { vitalite: 400, chance: 90, invocations: 1 } },
  { id: 'dd_doree_ebene', name: 'Dragodinde Dorée et Ebène', category: 'dragodindes', generation: 4, parents: [['dd_doree', 'dd_ebene']], sprite: `${BASE_URL}/doree-ebene.png`, stats: { vitalite: 400, agilite: 90, invocations: 1 } },
  { id: 'dd_indigo_ebene', name: 'Dragodinde Ebène et Indigo', category: 'dragodindes', generation: 4, parents: [['dd_indigo', 'dd_ebene']], sprite: `${BASE_URL}/ebene-indigo.png`, stats: { vitalite: 400, chance: 90, agilite: 90 } },

  // Génération 5
  { id: 'dd_pourpre', name: 'Dragodinde Pourpre', category: 'dragodindes', generation: 5, parents: [['dd_indigo_ebene', 'dd_amande_rousse']], sprite: `${BASE_URL}/pourpre.png`, stats: { vitalite: 400, force: 120 } },
  { id: 'dd_orchidee', name: 'Dragodinde Orchidée', category: 'dragodindes', generation: 5, parents: [['dd_indigo_ebene', 'dd_rousse_doree']], sprite: `${BASE_URL}/orchidee.png`, stats: { vitalite: 400, intelligence: 120 } },

  // Génération 6
  { id: 'dd_rousse_pourpre', name: 'Dragodinde Pourpre et Rousse', category: 'dragodindes', generation: 6, parents: [['dd_rousse', 'dd_pourpre']], sprite: `${BASE_URL}/pourpre-rousse.png`, stats: { vitalite: 400, force: 90, soins: 45 } },
  { id: 'dd_rousse_orchidee', name: 'Dragodinde Orchidée et Rousse', category: 'dragodindes', generation: 6, parents: [['dd_rousse', 'dd_orchidee']], sprite: `${BASE_URL}/orchidee-rousse.png`, stats: { vitalite: 400, intelligence: 90, soins: 45 } },
  { id: 'dd_amande_pourpre', name: 'Dragodinde Amande et Pourpre', category: 'dragodindes', generation: 6, parents: [['dd_amande', 'dd_pourpre']], sprite: `${BASE_URL}/amande-pourpre.png`, stats: { vitalite: 400, force: 90, initiative: 1200 } },
  { id: 'dd_amande_orchidee', name: 'Dragodinde Amande et Orchidée', category: 'dragodindes', generation: 6, parents: [['dd_amande', 'dd_orchidee']], sprite: `${BASE_URL}/amande-orchidee.png`, stats: { vitalite: 400, intelligence: 90, initiative: 1200 } },
  { id: 'dd_doree_pourpre', name: 'Dragodinde Dorée et Pourpre', category: 'dragodindes', generation: 6, parents: [['dd_doree', 'dd_pourpre']], sprite: `${BASE_URL}/doree-pourpre.png`, stats: { vitalite: 400, force: 90, invocations: 1 } },
  { id: 'dd_doree_orchidee', name: 'Dragodinde Dorée et Orchidée', category: 'dragodindes', generation: 6, parents: [['dd_doree', 'dd_orchidee']], sprite: `${BASE_URL}/doree-orchidee.png`, stats: { vitalite: 400, intelligence: 90, invocations: 1 } },
  { id: 'dd_indigo_pourpre', name: 'Dragodinde Indigo et Pourpre', category: 'dragodindes', generation: 6, parents: [['dd_indigo', 'dd_pourpre']], sprite: `${BASE_URL}/indigo-pourpre.png`, stats: { vitalite: 400, force: 90, chance: 90 } },
  { id: 'dd_indigo_orchidee', name: 'Dragodinde Indigo et Orchidée', category: 'dragodindes', generation: 6, parents: [['dd_indigo', 'dd_orchidee']], sprite: `${BASE_URL}/indigo-orchidee.png`, stats: { vitalite: 400, intelligence: 90, chance: 90 } },
  { id: 'dd_ebene_pourpre', name: 'Dragodinde Ebène et Pourpre', category: 'dragodindes', generation: 6, parents: [['dd_ebene', 'dd_pourpre']], sprite: `${BASE_URL}/ebene-pourpre.png`, stats: { vitalite: 400, force: 90, agilite: 90 } },
  { id: 'dd_ebene_orchidee', name: 'Dragodinde Ebène et Orchidée', category: 'dragodindes', generation: 6, parents: [['dd_ebene', 'dd_orchidee']], sprite: `${BASE_URL}/ebene-orchidee.png`, stats: { vitalite: 400, intelligence: 90, agilite: 90 } },
  { id: 'dd_pourpre_orchidee', name: 'Dragodinde Orchidée et Pourpre', category: 'dragodindes', generation: 6, parents: [['dd_pourpre', 'dd_orchidee']], sprite: `${BASE_URL}/orchidee-pourpre.png`, stats: { vitalite: 400, force: 90, intelligence: 90 } },

  // Génération 7
  { id: 'dd_ivoire', name: 'Dragodinde Ivoire', category: 'dragodindes', generation: 7, parents: [['dd_pourpre_orchidee', 'dd_indigo_pourpre']], sprite: `${BASE_URL}/ivoire.png`, stats: { vitalite: 400, puissance: 90 } },
  { id: 'dd_turquoise', name: 'Dragodinde Turquoise', category: 'dragodindes', generation: 7, parents: [['dd_pourpre_orchidee', 'dd_ebene_orchidee']], sprite: `${BASE_URL}/turquoise.png`, stats: { vitalite: 400, prospection: 90 } },

  // Génération 8
  { id: 'dd_rousse_ivoire', name: 'Dragodinde Ivoire et Rousse', category: 'dragodindes', generation: 8, parents: [['dd_rousse', 'dd_ivoire']], sprite: `${BASE_URL}/ivoire-rousse.png`, stats: { vitalite: 400, puissance: 70, soins: 45 } },
  { id: 'dd_rousse_turquoise', name: 'Dragodinde Turquoise et Rousse', category: 'dragodindes', generation: 8, parents: [['dd_rousse', 'dd_turquoise']], sprite: `${BASE_URL}/turquoise-rousse.png`, stats: { vitalite: 400, soins: 45, prospection: 70 } },
  { id: 'dd_amande_ivoire', name: 'Dragodinde Amande et Ivoire', category: 'dragodindes', generation: 8, parents: [['dd_amande', 'dd_ivoire']], sprite: `${BASE_URL}/amande-ivoire.png`, stats: { vitalite: 400, puissance: 70, initiative: 1200 } },
  { id: 'dd_amande_turquoise', name: 'Dragodinde Amande et Turquoise', category: 'dragodindes', generation: 8, parents: [['dd_amande', 'dd_turquoise']], sprite: `${BASE_URL}/amande-turquoise.png`, stats: { vitalite: 400, prospection: 70, initiative: 1200 } },
  { id: 'dd_doree_ivoire', name: 'Dragodinde Dorée et Ivoire', category: 'dragodindes', generation: 8, parents: [['dd_doree', 'dd_ivoire']], sprite: `${BASE_URL}/doree-ivoire.png`, stats: { vitalite: 400, puissance: 70, invocations: 1 } },
  { id: 'dd_doree_turquoise', name: 'Dragodinde Dorée et Turquoise', category: 'dragodindes', generation: 8, parents: [['dd_doree', 'dd_turquoise']], sprite: `${BASE_URL}/doree-turquoise.png`, stats: { vitalite: 400, invocations: 1, prospection: 70 } },
  { id: 'dd_indigo_ivoire', name: 'Dragodinde Indigo et Ivoire', category: 'dragodindes', generation: 8, parents: [['dd_indigo', 'dd_ivoire']], sprite: `${BASE_URL}/indigo-ivoire.png`, stats: { vitalite: 400, chance: 90, puissance: 70 } },
  { id: 'dd_indigo_turquoise', name: 'Dragodinde Indigo et Turquoise', category: 'dragodindes', generation: 8, parents: [['dd_indigo', 'dd_turquoise']], sprite: `${BASE_URL}/indigo-turquoise.png`, stats: { vitalite: 400, chance: 90, prospection: 70 } },
  { id: 'dd_ebene_ivoire', name: 'Dragodinde Ebène et Ivoire', category: 'dragodindes', generation: 8, parents: [['dd_ebene', 'dd_ivoire']], sprite: `${BASE_URL}/ebene-ivoire.png`, stats: { vitalite: 400, agilite: 90, puissance: 70 } },
  { id: 'dd_ebene_turquoise', name: 'Dragodinde Ebène et Turquoise', category: 'dragodindes', generation: 8, parents: [['dd_ebene', 'dd_turquoise']], sprite: `${BASE_URL}/ebene-turquoise.png`, stats: { vitalite: 400, agilite: 90, prospection: 70 } },
  { id: 'dd_pourpre_ivoire', name: 'Dragodinde Ivoire et Pourpre', category: 'dragodindes', generation: 8, parents: [['dd_pourpre', 'dd_ivoire']], sprite: `${BASE_URL}/ivoire-pourpre.png`, stats: { vitalite: 400, force: 90, puissance: 70 } },
  { id: 'dd_pourpre_turquoise', name: 'Dragodinde Turquoise et Pourpre', category: 'dragodindes', generation: 8, parents: [['dd_pourpre', 'dd_turquoise']], sprite: `${BASE_URL}/turquoise-pourpre.png`, stats: { vitalite: 400, force: 90, prospection: 70 } },
  { id: 'dd_orchidee_ivoire', name: 'Dragodinde Ivoire et Orchidée', category: 'dragodindes', generation: 8, parents: [['dd_orchidee', 'dd_ivoire']], sprite: `${BASE_URL}/ivoire-orchidee.png`, stats: { vitalite: 400, intelligence: 90, puissance: 70 } },
  { id: 'dd_orchidee_turquoise', name: 'Dragodinde Turquoise et Orchidée', category: 'dragodindes', generation: 8, parents: [['dd_orchidee', 'dd_turquoise']], sprite: `${BASE_URL}/turquoise-orchidee.png`, stats: { vitalite: 400, intelligence: 90, prospection: 70 } },
  { id: 'dd_ivoire_turquoise', name: 'Dragodinde Ivoire et Turquoise', category: 'dragodindes', generation: 8, parents: [['dd_ivoire', 'dd_turquoise']], sprite: `${BASE_URL}/ivoire-turquoise.png`, stats: { vitalite: 400, puissance: 70, prospection: 70 } },

  // Génération 9
  { id: 'dd_emeraude', name: 'Dragodinde Emeraude', category: 'dragodindes', generation: 9, parents: [['dd_ivoire_turquoise', 'dd_pourpre_ivoire']], sprite: `${BASE_URL}/emeraude.png`, stats: { vitalite: 400, critique: 14 } },
  { id: 'dd_prune', name: 'Dragodinde Prune', category: 'dragodindes', generation: 9, parents: [['dd_ivoire_turquoise', 'dd_orchidee_turquoise']], sprite: `${BASE_URL}/prune.png`, stats: { vitalite: 400, portee: 2 } },

  // Génération 10
  { id: 'dd_rousse_emeraude', name: 'Dragodinde Emeraude et Rousse', category: 'dragodindes', generation: 10, parents: [['dd_rousse', 'dd_emeraude']], sprite: `${BASE_URL}/emeraude-rousse.png`, stats: { vitalite: 400, critique: 10, soins: 45 } },
  { id: 'dd_rousse_prune', name: 'Dragodinde Prune et Rousse', category: 'dragodindes', generation: 10, parents: [['dd_rousse', 'dd_prune']], sprite: `${BASE_URL}/prune-rousse.png`, stats: { vitalite: 400, portee: 1, soins: 45 } },
  { id: 'dd_amande_emeraude', name: 'Dragodinde Amande et Emeraude', category: 'dragodindes', generation: 10, parents: [['dd_amande', 'dd_emeraude']], sprite: `${BASE_URL}/amande-emeraude.png`, stats: { vitalite: 400, critique: 10, initiative: 1200 } },
  { id: 'dd_amande_prune', name: 'Dragodinde Prune et Amande', category: 'dragodindes', generation: 10, parents: [['dd_amande', 'dd_prune']], sprite: `${BASE_URL}/prune-amande.png`, stats: { vitalite: 400, portee: 1, initiative: 1200 } },
  { id: 'dd_doree_emeraude', name: 'Dragodinde Dorée et Emeraude', category: 'dragodindes', generation: 10, parents: [['dd_doree', 'dd_emeraude']], sprite: `${BASE_URL}/doree-emeraude.png`, stats: { vitalite: 400, critique: 10, invocations: 1 } },
  { id: 'dd_doree_prune', name: 'Dragodinde Prune et Dorée', category: 'dragodindes', generation: 10, parents: [['dd_doree', 'dd_prune']], sprite: `${BASE_URL}/prune-doree.png`, stats: { vitalite: 400, portee: 1, invocations: 1 } },
  { id: 'dd_indigo_emeraude', name: 'Dragodinde Emeraude et Indigo', category: 'dragodindes', generation: 10, parents: [['dd_indigo', 'dd_emeraude']], sprite: `${BASE_URL}/emeraude-indigo.png`, stats: { vitalite: 400, chance: 90, critique: 10 } },
  { id: 'dd_indigo_prune', name: 'Dragodinde Prune et Indigo', category: 'dragodindes', generation: 10, parents: [['dd_indigo', 'dd_prune']], sprite: `${BASE_URL}/prune-indigo.png`, stats: { vitalite: 400, chance: 90, portee: 1 } },
  { id: 'dd_ebene_emeraude', name: 'Dragodinde Ebène et Emeraude', category: 'dragodindes', generation: 10, parents: [['dd_ebene', 'dd_emeraude']], sprite: `${BASE_URL}/ebene-emeraude.png`, stats: { vitalite: 400, agilite: 90, critique: 10 } },
  { id: 'dd_ebene_prune', name: 'Dragodinde Prune et Ebène', category: 'dragodindes', generation: 10, parents: [['dd_ebene', 'dd_prune']], sprite: `${BASE_URL}/prune-ebene.png`, stats: { vitalite: 400, agilite: 90, portee: 1 } },
  { id: 'dd_pourpre_emeraude', name: 'Dragodinde Emeraude et Pourpre', category: 'dragodindes', generation: 10, parents: [['dd_pourpre', 'dd_emeraude']], sprite: `${BASE_URL}/emeraude-pourpre.png`, stats: { vitalite: 400, force: 90, critique: 10 } },
  { id: 'dd_pourpre_prune', name: 'Dragodinde Prune et Pourpre', category: 'dragodindes', generation: 10, parents: [['dd_pourpre', 'dd_prune']], sprite: `${BASE_URL}/prune-pourpre.png`, stats: { vitalite: 400, force: 90, portee: 1 } },
  { id: 'dd_orchidee_emeraude', name: 'Dragodinde Emeraude et Orchidée', category: 'dragodindes', generation: 10, parents: [['dd_orchidee', 'dd_emeraude']], sprite: `${BASE_URL}/emeraude-orchidee.png`, stats: { vitalite: 400, intelligence: 90, critique: 10 } },
  { id: 'dd_orchidee_prune', name: 'Dragodinde Prune et Orchidée', category: 'dragodindes', generation: 10, parents: [['dd_orchidee', 'dd_prune']], sprite: `${BASE_URL}/prune-orchidee.png`, stats: { vitalite: 400, intelligence: 90, portee: 1 } },
  { id: 'dd_ivoire_emeraude', name: 'Dragodinde Emeraude et Ivoire', category: 'dragodindes', generation: 10, parents: [['dd_ivoire', 'dd_emeraude']], sprite: `${BASE_URL}/emeraude-ivoire.png`, stats: { vitalite: 400, puissance: 70, critique: 10 } },
  { id: 'dd_ivoire_prune', name: 'Dragodinde Prune et Ivoire', category: 'dragodindes', generation: 10, parents: [['dd_ivoire', 'dd_prune']], sprite: `${BASE_URL}/prune-ivoire.png`, stats: { vitalite: 400, puissance: 70, portee: 1 } },
  { id: 'dd_turquoise_emeraude', name: 'Dragodinde Emeraude et Turquoise', category: 'dragodindes', generation: 10, parents: [['dd_turquoise', 'dd_emeraude']], sprite: `${BASE_URL}/emeraude-turquoise.png`, stats: { vitalite: 400, critique: 10, prospection: 70 } },
  { id: 'dd_turquoise_prune', name: 'Dragodinde Prune et Turquoise', category: 'dragodindes', generation: 10, parents: [['dd_turquoise', 'dd_prune']], sprite: `${BASE_URL}/prune-turquoise.png`, stats: { vitalite: 400, portee: 1, prospection: 70 } },
  { id: 'dd_emeraude_prune', name: 'Dragodinde Prune et Emeraude', category: 'dragodindes', generation: 10, parents: [['dd_emeraude', 'dd_prune']], sprite: `${BASE_URL}/prune-emeraude.png`, stats: { vitalite: 400, critique: 10, portee: 1 } },

  // Spéciales (Hors reproduction)
  { id: 'dd_armure', name: 'Dragodinde en armure', category: 'dragodindes', generation: 0, sprite: `${BASE_URL}/armure.png`, stats: { puissance: 70, resistance: 7 } },
  { id: 'dd_plumes', name: 'Dragodinde à Plumes', category: 'dragodindes', generation: 0, sprite: `${BASE_URL}/plumes.png`, stats: { vitalite: 400, renvoi: 40 } },
];
