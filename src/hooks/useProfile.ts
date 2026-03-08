import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface Profile {
  username: string;
  ingameName: string;
  isVisible: boolean;
}

export function useProfile(userId?: string) {
  const [profile, setProfile] = useState<Profile>({ username: '', ingameName: '', isVisible: true });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data } = await supabase
      .from('user_profiles')
      .select('username, ingame_name, is_visible')
      .eq('user_id', userId)
      .maybeSingle();
    if (data) {
      setProfile({
        username: data.username ?? '',
        ingameName: data.ingame_name ?? '',
        isVisible: data.is_visible ?? true,
      });
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  async function checkUsernameAvailable(username: string): Promise<boolean> {
    const { data } = await supabase
      .from('user_profiles')
      .select('user_id')
      .eq('username', username)
      .neq('user_id', userId!)
      .maybeSingle();
    return !data;
  }

  async function saveUsername(username: string): Promise<'ok' | 'taken' | 'error'> {
    if (!userId) return 'error';
    setSaving(true);
    const available = await checkUsernameAvailable(username);
    if (!available) { setSaving(false); return 'taken'; }
    const { error } = await supabase
      .from('user_profiles')
      .update({ username, updated_at: new Date().toISOString() })
      .eq('user_id', userId);
    setSaving(false);
    if (error) return 'error';
    setProfile((p) => ({ ...p, username }));
    return 'ok';
  }

  async function saveIngameName(ingameName: string) {
    if (!userId) return;
    setSaving(true);
    await supabase
      .from('user_profiles')
      .update({ ingame_name: ingameName, updated_at: new Date().toISOString() })
      .eq('user_id', userId);
    setSaving(false);
    setProfile((p) => ({ ...p, ingameName }));
  }

  async function saveVisibility(isVisible: boolean) {
    if (!userId) return;
    await supabase
      .from('user_profiles')
      .update({ is_visible: isVisible, updated_at: new Date().toISOString() })
      .eq('user_id', userId);
    setProfile((p) => ({ ...p, isVisible }));
  }

  async function deleteAccount(): Promise<boolean> {
    if (!userId) return false;
    const { error } = await supabase.rpc('delete_own_account');
    if (error) return false;
    await supabase.auth.signOut();
    return true;
  }

  return { profile, loading, saving, saveUsername, saveIngameName, saveVisibility, deleteAccount };
}
