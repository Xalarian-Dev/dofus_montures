export type MountCategory = "dragodindes" | "muldos" | "volkornes";

export interface MountSpecies {
  id: string; // e.g. 'dd_amande', 'muldo_ebene'
  name: string; // e.g. "Dragodinde Amande"
  category: MountCategory;
  generation: number; // 1 to x
  parents?: [string, string][]; // All possible parent combinations to breed this species, if not a base mount.
  sprite?: string; // URL to the sprite image
  stats?: MountStats; // Bonus stats at max level (level 100)
}

export interface BreedingInventory {
  [mountId: string]: {
    maleCount: number;
    femaleCount: number;
    done?: boolean;
    stepDone?: boolean;
    stepCount?: number;
    stepMaleCount?: number;
    stepFemaleCount?: number;
  };
}

export interface GenerationAchievement {
  name: string;
  description: string;
  points: number;
}

export interface MountStats {
  vitalite?: number;
  force?: number;
  intelligence?: number;
  agilite?: number;
  chance?: number;
  initiative?: number;
  prospection?: number;
  invocations?: number;
  soins?: number;
  puissance?: number;
  critique?: number;
  portee?: number;
  resistance?: number;
  resistanceFeu?: number;
  resistanceEau?: number;
  resistanceTerre?: number;
  resistanceAir?: number;
  renvoi?: number;
  tacle?: number;
  fuite?: number;
  esquivePA?: number;
  esquivePM?: number;
  dommagesCritiques?: number;
  dommagesTerre?: number;
  dommagesFeu?: number;
  dommagesEau?: number;
  dommagesAir?: number;
  pa?: number;
  pm?: number;
  dommagesPoussee?: number;
  resistancesPoussee?: number;
  retraitPA?: number;
  retraitPM?: number;
  resistancesCritiques?: number;
}
