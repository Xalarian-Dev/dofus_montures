import { create } from 'zustand';
import { BreedingInventory, MountCategory } from '../types/mount';
import { supabase } from '@/lib/supabase';

export type ObjectiveTarget = { targetId: string; targetType: 'monture' | 'succes'; allowCloning: boolean };

interface BreedingState {
  inventory: BreedingInventory;
  objectives: Partial<Record<MountCategory, ObjectiveTarget>>;
  /** Persists allowCloning per category independently of whether an objective is active. */
  allowCloningByCategory: Partial<Record<MountCategory, boolean>>;
  setMaleCount: (mountId: string, count: number) => void;
  setFemaleCount: (mountId: string, count: number) => void;
  setDone: (mountId: string, done: boolean) => void;
  setObjective: (category: MountCategory, targetId: string, targetType: 'monture' | 'succes') => Promise<void>;
  setAllowCloning: (category: MountCategory, allowCloning: boolean) => Promise<void>;
  removeObjective: (category: MountCategory) => Promise<void>;
  loadFromSupabase: (userId: string) => Promise<void>;
  resetAll: (userId: string) => Promise<void>;
}

async function upsertToSupabase(userId: string, mountId: string, maleCount: number, femaleCount: number, done: boolean) {
  await supabase.from('breeding_inventory').upsert({
    user_id: userId,
    mount_id: mountId,
    male_count: maleCount,
    female_count: femaleCount,
    done,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,mount_id' });
}

export const useBreedingStore = create<BreedingState>()((set, get) => ({
  inventory: {},
  objectives: {},
  allowCloningByCategory: {},

  setMaleCount: (mountId, count) => {
    const clamped = Math.max(0, count);
    set((state) => ({
      inventory: {
        ...state.inventory,
        [mountId]: { ...state.inventory[mountId], maleCount: clamped },
      },
    }));
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        const entry = get().inventory[mountId];
        upsertToSupabase(data.user.id, mountId, clamped, entry?.femaleCount ?? 0, entry?.done ?? false);
      }
    });
  },

  setFemaleCount: (mountId, count) => {
    const clamped = Math.max(0, count);
    set((state) => ({
      inventory: {
        ...state.inventory,
        [mountId]: { ...state.inventory[mountId], femaleCount: clamped },
      },
    }));
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        const entry = get().inventory[mountId];
        upsertToSupabase(data.user.id, mountId, entry?.maleCount ?? 0, clamped, entry?.done ?? false);
      }
    });
  },

  setDone: (mountId, done) => {
    set((state) => ({
      inventory: {
        ...state.inventory,
        [mountId]: { ...state.inventory[mountId], done },
      },
    }));
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        const entry = get().inventory[mountId];
        upsertToSupabase(data.user.id, mountId, entry?.maleCount ?? 0, entry?.femaleCount ?? 0, done);
      }
    });
  },

  removeObjective: async (category) => {
    set((state) => {
      const next = { ...state.objectives };
      delete next[category];
      return { objectives: next };
    });
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;
    await supabase.from('user_objectives').delete().eq('user_id', data.user.id).eq('category', category);
  },

  setObjective: async (category, targetId, targetType) => {
    set((state) => ({
      objectives: {
        ...state.objectives,
        [category]: { targetId, targetType, allowCloning: state.allowCloningByCategory[category] ?? state.objectives[category]?.allowCloning ?? false },
      },
    }));
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;
    const allowCloning = get().objectives[category]?.allowCloning ?? false;
    await supabase.from('user_objectives').upsert(
      { user_id: data.user.id, category, target_id: targetId, target_type: targetType, allow_cloning: allowCloning, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,category' }
    );
  },

  setAllowCloning: async (category, allowCloning) => {
    set((state) => {
      const current = state.objectives[category];
      return {
        allowCloningByCategory: { ...state.allowCloningByCategory, [category]: allowCloning },
        objectives: current ? { ...state.objectives, [category]: { ...current, allowCloning } } : state.objectives,
      };
    });
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;
    await supabase.from('user_objectives')
      .update({ allow_cloning: allowCloning, updated_at: new Date().toISOString() })
      .eq('user_id', data.user.id)
      .eq('category', category);
  },

  loadFromSupabase: async (userId) => {
    const [inventoryRes, objectivesRes] = await Promise.all([
      supabase.from('breeding_inventory').select('mount_id, male_count, female_count, done').eq('user_id', userId),
      supabase.from('user_objectives').select('category, target_id, target_type, allow_cloning').eq('user_id', userId),
    ]);

    if (inventoryRes.data) {
      const inventory: BreedingInventory = {};
      for (const row of inventoryRes.data) {
        inventory[row.mount_id] = {
          maleCount: row.male_count,
          femaleCount: row.female_count,
          done: row.done ?? false,
        };
      }
      set({ inventory });
    }

    if (objectivesRes.data) {
      const objectives: Partial<Record<MountCategory, ObjectiveTarget>> = {};
      const allowCloningByCategory: Partial<Record<MountCategory, boolean>> = {};
      for (const row of objectivesRes.data) {
        const cat = row.category as MountCategory;
        const allowCloning = row.allow_cloning ?? false;
        objectives[cat] = { targetId: row.target_id, targetType: row.target_type, allowCloning };
        allowCloningByCategory[cat] = allowCloning;
      }
      set({ objectives, allowCloningByCategory });
    }
  },

  resetAll: async (userId) => {
    await Promise.all([
      supabase.from('breeding_inventory').delete().eq('user_id', userId),
      supabase.from('user_objectives').delete().eq('user_id', userId),
    ]);
    set({ inventory: {}, objectives: {} });
  },
}));
