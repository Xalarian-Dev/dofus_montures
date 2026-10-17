import { useState, useEffect, useCallback } from 'react';
import { notifications } from '@mantine/notifications';
import { supabase } from '@/lib/supabase';

export interface Profile {
  username: string;
  ingameName: string;
  isVisible: boolean;
  realm: string;
}

function notifySaveError() {
  notifications.show({
    title: 'Enregistrement impossible',
    message: 'Votre réglage n\'a pas été enregistré. Vérifiez votre connexion et réessayez.',
    color: 'red',
  });
}

export function useProfile(userId?: string) {
  const [profile, setProfile] = useState<Profile>({ username: '', ingameName: '', isVisible: true, realm: '' });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data } = await supabase
      .from('user_profiles')
      .select('username, ingame_name, is_visible, realm')
      .eq('user_id', userId)
      .maybeSingle();
    if (data) {
      setProfile({
        username: data.username ?? '',
        ingameName: data.ingame_name ?? '',
        isVisible: data.is_visible ?? true,
        realm: data.realm ?? '',
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

  async function saveIngameName(ingameName: string): Promise<boolean> {
    if (!userId) return false;
    setSaving(true);
    const { error } = await supabase
      .from('user_profiles')
      .update({ ingame_name: ingameName, updated_at: new Date().toISOString() })
      .eq('user_id', userId);
    setSaving(false);
    if (error) { notifySaveError(); return false; }
    setProfile((p) => ({ ...p, ingameName }));
    return true;
  }

  async function saveRealm(realm: string) {
    if (!userId) return;
    const { error } = await supabase
      .from('user_profiles')
      .update({ realm, updated_at: new Date().toISOString() })
      .eq('user_id', userId);
    if (error) { notifySaveError(); return; }
    setProfile((p) => ({ ...p, realm }));
  }

  async function saveVisibility(isVisible: boolean) {
    if (!userId) return;
    const { error } = await supabase
      .from('user_profiles')
      .update({ is_visible: isVisible, updated_at: new Date().toISOString() })
      .eq('user_id', userId);
    if (error) { notifySaveError(); return; }
    setProfile((p) => ({ ...p, isVisible }));
  }

  async function deleteAccount(): Promise<boolean> {
    if (!userId) return false;
    const { error } = await supabase.rpc('delete_own_account');
    if (error) return false;
    await supabase.auth.signOut();
    return true;
  }

  return { profile, loading, saving, saveUsername, saveIngameName, saveRealm, saveVisibility, deleteAccount };
}
