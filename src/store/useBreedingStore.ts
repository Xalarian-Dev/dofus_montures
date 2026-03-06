import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BreedingInventory } from '../types/mount';

interface BreedingState {
  inventory: BreedingInventory;
  setMaleCount: (mountId: string, count: number) => void;
  setFemaleCount: (mountId: string, count: number) => void;
  incrementMale: (mountId: string) => void;
  decrementMale: (mountId: string) => void;
  incrementFemale: (mountId: string) => void;
  decrementFemale: (mountId: string) => void;
}

export const useBreedingStore = create<BreedingState>()(
  persist(
    (set) => ({
      inventory: {},
      setMaleCount: (mountId, count) => set((state) => ({
        inventory: {
          ...state.inventory,
          [mountId]: {
            ...state.inventory[mountId],
            maleCount: Math.max(0, count)
          }
        }
      })),
      setFemaleCount: (mountId, count) => set((state) => ({
        inventory: {
          ...state.inventory,
          [mountId]: {
            ...state.inventory[mountId],
            femaleCount: Math.max(0, count)
          }
        }
      })),
      incrementMale: (mountId) => set((state) => ({
        inventory: {
          ...state.inventory,
          [mountId]: {
            femaleCount: state.inventory[mountId]?.femaleCount || 0,
            maleCount: (state.inventory[mountId]?.maleCount || 0) + 1
          }
        }
      })),
      decrementMale: (mountId) => set((state) => ({
        inventory: {
          ...state.inventory,
          [mountId]: {
            ...state.inventory[mountId],
            maleCount: Math.max(0, (state.inventory[mountId]?.maleCount || 0) - 1)
          }
        }
      })),
      incrementFemale: (mountId) => set((state) => ({
        inventory: {
          ...state.inventory,
          [mountId]: {
            maleCount: state.inventory[mountId]?.maleCount || 0,
            femaleCount: (state.inventory[mountId]?.femaleCount || 0) + 1
          }
        }
      })),
      decrementFemale: (mountId) => set((state) => ({
        inventory: {
          ...state.inventory,
          [mountId]: {
            ...state.inventory[mountId],
            femaleCount: Math.max(0, (state.inventory[mountId]?.femaleCount || 0) - 1)
          }
        }
      })),
    }),
    {
      name: 'dofus-breeding-storage', // key in local storage
    }
  )
);
