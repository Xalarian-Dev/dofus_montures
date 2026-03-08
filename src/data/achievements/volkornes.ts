import { GenerationAchievement } from '@/types/mount';

export const volkskorneAchievements: Record<number, GenerationAchievement> = {
  1: {
    name: "Prélèvement cornu",
    description: "Capturer les Volkornes.",
    points: 10,
  },
  2: {
    name: "Volkorne : Deuxième génération",
    description: "Obtenir la naissance de tous les Volkornes de deuxième génération.",
    points: 10,
  },
  3: {
    name: "Volkorne : Troisième génération",
    description: "Obtenir la naissance de tous les Volkornes de troisième génération.",
    points: 20,
  },
  4: {
    name: "Volkorne : Quatrième génération",
    description: "Obtenir la naissance de tous les Volkornes de quatrième génération.",
    points: 20,
  },
  5: {
    name: "Volkorne : Cinquième génération",
    description: "Obtenir la naissance de tous les Volkornes de cinquième génération.",
    points: 30,
  },
  6: {
    name: "Volkorne : Sixième génération",
    description: "Obtenir la naissance de tous les Volkornes de sixième génération.",
    points: 30,
  },
  7: {
    name: "Volkorne : Septième génération",
    description: "Obtenir la naissance de tous les Volkornes de septième génération.",
    points: 40,
  },
  8: {
    name: "Volkorne : Huitième génération",
    description: "Obtenir la naissance de tous les Volkornes de huitième génération.",
    points: 40,
  },
  9: {
    name: "Volkorne : Neuvième génération",
    description: "Obtenir la naissance de tous les Volkornes de neuvième génération.",
    points: 50,
  },
  10: {
    name: "Volkorne : Dixième génération",
    description: "Obtenir la naissance de tous les Volkornes de dixième génération.",
    points: 50,
  },
};

export const volkskorneMetaAchievement: GenerationAchievement = {
  name: "Générations V",
  description: "Obtenir les succès : Prélèvement cornu, et toutes les générations de Volkornes.",
  points: 50,
};
