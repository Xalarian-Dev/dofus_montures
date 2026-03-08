import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from './useTrade';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  readAt?: string;
}

export interface Conversation {
  id: string;
  participantA: string;
  participantB: string;
  updatedAt: string;
  lastMessage?: Message;
  unreadCount: number;
}

function mapMessage(m: Record<string, string>): Message {
  return {
    id: m.id,
    conversationId: m.conversation_id,
    senderId: m.sender_id,
    content: m.content,
    createdAt: m.created_at,
    readAt: m.read_at ?? undefined,
  };
}

export function useMessages(currentUserId?: string) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Map<string, Message[]>>(new Map());
  const [profiles, setProfiles] = useState<Map<string, UserProfile>>(new Map());
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const fetchProfiles = useCallback(async (userIds: string[]) => {
    if (!userIds.length) return;
    const { data } = await supabase
      .from('user_profiles')
      .select('user_id, full_name, avatar_url, username')
      .in('user_id', userIds);
    if (data) {
      setProfiles((prev) => {
        const next = new Map(prev);
        for (const p of data)
          next.set(p.user_id, { userId: p.user_id, fullName: p.full_name, avatarUrl: p.avatar_url, username: p.username });
        return next;
      });
    }
  }, []);

  const fetchConversations = useCallback(async () => {
    if (!currentUserId) return;
    const { data } = await supabase
      .from('conversations')
      .select('id, participant_a, participant_b, updated_at')
      .or(`participant_a.eq.${currentUserId},participant_b.eq.${currentUserId}`)
      .order('updated_at', { ascending: false });

    if (!data) return;

    const enriched = await Promise.all(
      data.map(async (c) => {
        const [lastMsgRes, unreadRes] = await Promise.all([
          supabase.from('messages').select('*').eq('conversation_id', c.id)
            .order('created_at', { ascending: false }).limit(1),
          supabase.from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', c.id)
            .neq('sender_id', currentUserId)
            .is('read_at', null),
        ]);
        return {
          id: c.id,
          participantA: c.participant_a,
          participantB: c.participant_b,
          updatedAt: c.updated_at,
          lastMessage: lastMsgRes.data?.[0] ? mapMessage(lastMsgRes.data[0]) : undefined,
          unreadCount: unreadRes.count ?? 0,
        };
      })
    );

    setConversations(enriched);

    const otherIds = [...new Set(
      enriched.map((c) => c.participantA === currentUserId ? c.participantB : c.participantA)
    )];
    fetchProfiles(otherIds);
  }, [currentUserId, fetchProfiles]);

  const fetchMessages = useCallback(async (conversationId: string) => {
    const { data } = await supabase
      .from('messages').select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (data) {
      setMessages((prev) => new Map(prev).set(conversationId, data.map(mapMessage)));
    }

    if (currentUserId) {
      await supabase.from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .neq('sender_id', currentUserId)
        .is('read_at', null);

      setConversations((prev) =>
        prev.map((c) => c.id === conversationId ? { ...c, unreadCount: 0 } : c)
      );
    }
  }, [currentUserId]);

  const sendMessage = useCallback(async (conversationId: string, content: string) => {
    if (!currentUserId || !content.trim()) return;
    const { data } = await supabase
      .from('messages')
      .insert({ conversation_id: conversationId, sender_id: currentUserId, content: content.trim() })
      .select().single();

    if (data) {
      const msg = mapMessage(data);
      setMessages((prev) => {
        const current = prev.get(conversationId) ?? [];
        return new Map(prev).set(conversationId, [...current, msg]);
      });
      await supabase.from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);
      setConversations((prev) => {
        const conv = prev.find((c) => c.id === conversationId);
        if (!conv) return prev;
        return [{ ...conv, updatedAt: msg.createdAt, lastMessage: msg }, ...prev.filter((c) => c.id !== conversationId)];
      });
    }
  }, [currentUserId]);

  const getOrCreateConversation = useCallback(async (otherUserId: string): Promise<string | null> => {
    if (!currentUserId) return null;
    const { data: existing } = await supabase
      .from('conversations').select('id')
      .or(`and(participant_a.eq.${currentUserId},participant_b.eq.${otherUserId}),and(participant_a.eq.${otherUserId},participant_b.eq.${currentUserId})`)
      .maybeSingle();

    if (existing) return existing.id;

    const { data } = await supabase
      .from('conversations')
      .insert({ participant_a: currentUserId, participant_b: otherUserId })
      .select('id').single();

    if (data) {
      await fetchConversations();
      return data.id;
    }
    return null;
  }, [currentUserId, fetchConversations]);

  useEffect(() => {
    if (!currentUserId) {
      setConversations([]);
      return;
    }
    fetchConversations();

    channelRef.current = supabase
      .channel(`inbox-${currentUserId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const msg = mapMessage(payload.new as Record<string, string>);
        setMessages((prev) => {
          if (!prev.has(msg.conversationId)) return prev;
          const current = prev.get(msg.conversationId)!;
          if (current.some((m) => m.id === msg.id)) return prev;
          return new Map(prev).set(msg.conversationId, [...current, msg]);
        });
        fetchConversations();
      })
      .subscribe();

    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current);
    };
  }, [currentUserId]);

  const unreadTotal = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return { conversations, messages, profiles, unreadTotal, fetchMessages, sendMessage, getOrCreateConversation, refetch: fetchConversations };
}
