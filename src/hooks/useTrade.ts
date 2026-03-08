import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export type TradeGender = 'male' | 'female';

export interface UserProfile {
  userId: string;
  fullName?: string;
  avatarUrl?: string;
  username?: string;
}

export interface TradeListing {
  mountId: string;
  category: string;
  gender: TradeGender;
  quantity: number;
  note?: string;
}

export interface UserTrade {
  profile: UserProfile;
  listings: TradeListing[];
}

// myListings: Map<mountId, Set<gender>> — which genders I'm offering per mount
export type MyListings = Map<string, Set<TradeGender>>;

export function useTrade(currentUserId?: string) {
  const [myListings, setMyListings] = useState<MyListings>(new Map());
  const [allTrades, setAllTrades] = useState<UserTrade[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMyListings = useCallback(async () => {
    if (!currentUserId) { setMyListings(new Map()); return; }
    const { data } = await supabase
      .from('trade_listings')
      .select('mount_id, gender')
      .eq('user_id', currentUserId);
    if (data) {
      const map: MyListings = new Map();
      for (const r of data) {
        if (!map.has(r.mount_id)) map.set(r.mount_id, new Set());
        map.get(r.mount_id)!.add(r.gender as TradeGender);
      }
      setMyListings(map);
    }
  }, [currentUserId]);

  const fetchAllTrades = useCallback(async () => {
    setLoading(true);
    try {
      const { data: listings } = await supabase
        .from('trade_listings')
        .select('user_id, mount_id, category, gender, quantity, note')
        .order('created_at', { ascending: false });

      if (!listings?.length) { setAllTrades([]); return; }

      const userIds = [...new Set(listings.map((l) => l.user_id))];
      const { data: profiles } = await supabase
        .from('user_profiles')
        .select('user_id, full_name, avatar_url, username')
        .in('user_id', userIds)
        .eq('is_visible', true);

      const profileMap = new Map((profiles ?? []).map((p) => [p.user_id, p]));

      const byUser = new Map<string, TradeListing[]>();
      for (const l of listings) {
        if (!byUser.has(l.user_id)) byUser.set(l.user_id, []);
        byUser.get(l.user_id)!.push({
          mountId: l.mount_id,
          category: l.category,
          gender: l.gender as TradeGender,
          quantity: l.quantity,
          note: l.note ?? undefined,
        });
      }

      const trades: UserTrade[] = [];
      for (const [userId, userListings] of byUser) {
        if (userId === currentUserId) continue;
        const p = profileMap.get(userId);
        trades.push({
          profile: { userId, fullName: p?.full_name, avatarUrl: p?.avatar_url, username: p?.username },
          listings: userListings,
        });
      }
      setAllTrades(trades);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  const toggleListing = useCallback(async (
    mountId: string,
    category: string,
    gender: TradeGender,
    enable: boolean
  ) => {
    if (!currentUserId) return;
    if (enable) {
      await supabase.from('trade_listings').upsert(
        { user_id: currentUserId, mount_id: mountId, category, gender, quantity: 1 },
        { onConflict: 'user_id,mount_id,gender' }
      );
      setMyListings((prev) => {
        const next = new Map(prev);
        if (!next.has(mountId)) next.set(mountId, new Set());
        next.get(mountId)!.add(gender);
        return next;
      });
    } else {
      await supabase.from('trade_listings').delete()
        .eq('user_id', currentUserId).eq('mount_id', mountId).eq('gender', gender);
      setMyListings((prev) => {
        const next = new Map(prev);
        const genders = next.get(mountId);
        if (genders) {
          genders.delete(gender);
          if (genders.size === 0) next.delete(mountId);
        }
        return next;
      });
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchMyListings();
    fetchAllTrades();
  }, [fetchMyListings, fetchAllTrades]);

  return { myListings, allTrades, loading, toggleListing, refetch: fetchAllTrades };
}
