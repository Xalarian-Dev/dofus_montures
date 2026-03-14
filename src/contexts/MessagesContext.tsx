import { createContext, useContext, ReactNode } from 'react';
import { useMessages } from '@/hooks/useMessages';
import { useAuth } from '@/hooks/useAuth';
import type { Conversation, Message } from '@/hooks/useMessages';

type MessagesContextValue = ReturnType<typeof useMessages>;

const MessagesContext = createContext<MessagesContextValue | null>(null);

export function MessagesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const messages = useMessages(user?.id);
  return <MessagesContext.Provider value={messages}>{children}</MessagesContext.Provider>;
}

export function useMessagesContext(): MessagesContextValue {
  const ctx = useContext(MessagesContext);
  if (!ctx) throw new Error('useMessagesContext must be used within MessagesProvider');
  return ctx;
}
