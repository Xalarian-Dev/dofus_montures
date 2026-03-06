export type MountCategory = "dragodindes" | "muldos" | "volkornes";

export interface MountSpecies {
  id: string; // e.g. 'dd_amande', 'muldo_ebene'
  name: string; // e.g. "Dragodinde Amande"
  category: MountCategory;
  generation: number; // 1 to x
  parents?: [string, string]; // IDs of the required parents to breed this species, if not a base mount.
}

export interface BreedingInventory {
  [mountId: string]: {
    maleCount: number;
    femaleCount: number;
  };
}
