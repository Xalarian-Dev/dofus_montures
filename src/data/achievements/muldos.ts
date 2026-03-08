import { GenerationAchievement } from '@/types/mount';

export const muldoAchievements: Record<number, GenerationAchievement> = {
  1: {
    name: "Prélèvement marin",
    description: "Capturer les Muldos.",
    points: 10,
  },
  2: {
    name: "Muldo : Deuxième génération",
    description: "Obtenir la naissance de tous les Muldos de deuxième génération.",
    points: 10,
  },
  3: {
    name: "Muldo : Troisième génération",
    description: "Obtenir la naissance de tous les Muldos de troisième génération.",
    points: 20,
  },
  4: {
    name: "Muldo : Quatrième génération",
    description: "Obtenir la naissance de tous les Muldos de quatrième génération.",
    points: 20,
  },
  5: {
    name: "Muldo : Cinquième génération",
    description: "Obtenir la naissance de tous les Muldos de cinquième génération.",
    points: 30,
  },
  6: {
    name: "Muldo : Sixième génération",
    description: "Obtenir la naissance de tous les Muldos de sixième génération.",
    points: 30,
  },
  7: {
    name: "Muldo : Septième génération",
    description: "Obtenir la naissance de tous les Muldos de septième génération.",
    points: 40,
  },
  8: {
    name: "Muldo : Huitième génération",
    description: "Obtenir la naissance de tous les Muldos de huitième génération.",
    points: 40,
  },
  9: {
    name: "Muldo : Neuvième génération",
    description: "Obtenir la naissance de tous les Muldos de neuvième génération.",
    points: 50,
  },
  10: {
    name: "Muldo : Dixième génération",
    description: "Obtenir la naissance de tous les Muldos de dixième génération.",
    points: 50,
  },
};

export const muldoMetaAchievement: GenerationAchievement = {
  name: "Générations aquatiques",
  description: "Obtenir les succès : Prélèvement marin, et toutes les générations de Muldos.",
  points: 50,
};
