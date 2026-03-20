import { create } from 'zustand';
import { BreedingInventory, MountCategory } from '../types/mount';
import { supabase } from '@/lib/supabase';

export type ObjectiveTarget = { targetId: string; targetType: 'monture' | 'succes'; allowCloning: boolean };

interface BreedingState {
  inventory: BreedingInventory;
  objectives: Partial<Record<MountCategory, ObjectiveTarget>>;
  /** Persists allowCloning per category independently of whether an objective is active. */
  allowCloningByCategory: Partial<Record<MountCategory, boolean>>;
  /** Local-only: mounts the user is looking for in trades. */
  wantedMounts: Record<string, { male: boolean; female: boolean }>;
  setMaleCount: (mountId: string, count: number) => void;
  setFemaleCount: (mountId: string, count: number) => void;
  setDone: (mountId: string, done: boolean) => void;
  setStepDone: (mountId: string, stepDone: boolean) => void;
  setStepCount: (mountId: string, stepCount: number) => void;
  setStepMaleCount: (mountId: string, count: number) => void;
  setStepFemaleCount: (mountId: string, count: number) => void;
  setWanted: (mountId: string, gender: 'male' | 'female', wanted: boolean) => void;
  setObjective: (category: MountCategory, targetId: string, targetType: 'monture' | 'succes') => Promise<void>;
  setAllowCloning: (category: MountCategory, allowCloning: boolean) => Promise<void>;
  removeObjective: (category: MountCategory) => Promise<void>;
  loadFromSupabase: (userId: string) => Promise<void>;
  resetAll: (userId: string) => Promise<void>;
}

async function upsertToSupabase(userId: string, mountId: string, entry: BreedingInventory[string]) {
  const e = entry ?? {};
  await supabase.from('breeding_inventory').upsert({
    user_id: userId,
    mount_id: mountId,
    male_count: e.maleCount ?? 0,
    female_count: e.femaleCount ?? 0,
    done: e.done ?? false,
    step_done: e.stepDone ?? false,
    step_count: e.stepCount ?? 0,
    step_male_count: e.stepMaleCount ?? 0,
    step_female_count: e.stepFemaleCount ?? 0,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,mount_id' });
}

// Per-mount debounce: batches rapid changes into a single DB write.
const DEBOUNCE_MS = 2000;
const pendingTimers = new Map<string, ReturnType<typeof setTimeout>>();
const dirtyMounts = new Set<string>();

function scheduleDebouncedUpsert(mountId: string) {
  dirtyMounts.add(mountId);
  const existing = pendingTimers.get(mountId);
  if (existing) clearTimeout(existing);
  pendingTimers.set(mountId, setTimeout(() => flushMount(mountId), DEBOUNCE_MS));
}

async function flushMount(mountId: string) {
  pendingTimers.delete(mountId);
  dirtyMounts.delete(mountId);
  const { data } = await supabase.auth.getUser();
  if (!data.user) return;
  const entry = useBreedingStore.getState().inventory[mountId];
  await upsertToSupabase(data.user.id, mountId, entry);
}

/** Flush all pending debounced writes immediately. */
export function flushAllPending() {
  for (const [mountId, timer] of pendingTimers) {
    clearTimeout(timer);
    pendingTimers.delete(mountId);
    flushMount(mountId);
  }
}

// Flush on page unload so no data is lost.
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', flushAllPending);
}

export const useBreedingStore = create<BreedingState>()((set, get) => ({
  inventory: {},
  objectives: {},
  allowCloningByCategory: {},
  wantedMounts: {},

  setMaleCount: (mountId, count) => {
    const clamped = Math.max(0, count);
    set((state) => ({
      inventory: {
        ...state.inventory,
        [mountId]: { ...state.inventory[mountId], maleCount: clamped },
      },
    }));
    scheduleDebouncedUpsert(mountId);
  },

  setFemaleCount: (mountId, count) => {
    const clamped = Math.max(0, count);
    set((state) => ({
      inventory: {
        ...state.inventory,
        [mountId]: { ...state.inventory[mountId], femaleCount: clamped },
      },
    }));
    scheduleDebouncedUpsert(mountId);
  },

  setWanted: (mountId, gender, wanted) => {
    set((state) => {
      const current = state.wantedMounts[mountId] ?? { male: false, female: false };
      return {
        wantedMounts: {
          ...state.wantedMounts,
          [mountId]: { ...current, [gender]: wanted },
        },
      };
    });
  },

  setDone: (mountId, done) => {
    set((state) => ({
      inventory: {
        ...state.inventory,
        [mountId]: { ...state.inventory[mountId], done },
      },
    }));
    scheduleDebouncedUpsert(mountId);
  },

  setStepDone: (mountId, stepDone) => {
    set((state) => ({
      inventory: {
        ...state.inventory,
        [mountId]: {
          ...state.inventory[mountId],
          stepDone,
          // Checking a step also marks the mount as obtained in résumé
          ...(stepDone ? { done: true } : {}),
        },
      },
    }));
    scheduleDebouncedUpsert(mountId);
  },

  setStepCount: (mountId, stepCount) => {
    const clamped = Math.max(0, stepCount);
    set((state) => ({
      inventory: {
        ...state.inventory,
        [mountId]: { ...state.inventory[mountId], stepCount: clamped },
      },
    }));
    scheduleDebouncedUpsert(mountId);
  },

  setStepMaleCount: (mountId, count) => {
    const clamped = Math.max(0, count);
    set((state) => ({
      inventory: {
        ...state.inventory,
        [mountId]: { ...state.inventory[mountId], stepMaleCount: clamped },
      },
    }));
    scheduleDebouncedUpsert(mountId);
  },

  setStepFemaleCount: (mountId, count) => {
    const clamped = Math.max(0, count);
    set((state) => ({
      inventory: {
        ...state.inventory,
        [mountId]: { ...state.inventory[mountId], stepFemaleCount: clamped },
      },
    }));
    scheduleDebouncedUpsert(mountId);
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
      supabase.from('breeding_inventory').select('mount_id, male_count, female_count, done, step_done, step_count, step_male_count, step_female_count').eq('user_id', userId),
      supabase.from('user_objectives').select('category, target_id, target_type, allow_cloning').eq('user_id', userId),
    ]);

    if (inventoryRes.data) {
      const inventory: BreedingInventory = {};
      for (const row of inventoryRes.data) {
        inventory[row.mount_id] = {
          maleCount: row.male_count,
          femaleCount: row.female_count,
          done: row.done ?? false,
          stepDone: row.step_done ?? false,
          stepCount: row.step_count ?? 0,
          stepMaleCount: row.step_male_count ?? 0,
          stepFemaleCount: row.step_female_count ?? 0,
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
