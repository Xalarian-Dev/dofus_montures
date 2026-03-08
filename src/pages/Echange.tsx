import { useState, useRef, useEffect } from 'react';
import {
  Container, Title, Text, Stack, Tabs, Paper, Group, Avatar, Badge, SimpleGrid,
  Image, Button, ActionIcon, TextInput, ScrollArea, Loader, Center, Select,
  Indicator, Divider, Box, Anchor,
} from '@mantine/core';
import { Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Send, MessageCircle, ArrowLeftRight, Plus, Minus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTrade, UserTrade } from '@/hooks/useTrade';
import { useMessages, Conversation } from '@/hooks/useMessages';
import { useProfile } from '@/hooks/useProfile';
import { dragodindes } from '@/data/mounts/dragodindes';
import { muldos } from '@/data/mounts/muldos';
import { volkornes } from '@/data/mounts/volkornes';

const allMounts = [...dragodindes, ...muldos, ...volkornes];
const mountMap = new Map(allMounts.map((m) => [m.id, m]));

function UserAvatar({ avatarUrl, name, size = 'md' }: { avatarUrl?: string; name?: string; size?: string }) {
  return (
    <Avatar size={size} radius="xl">
      {avatarUrl
        ? <img src={avatarUrl} alt={name} referrerPolicy="no-referrer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : <Text size="xs" fw={700}>{(name ?? '?')[0].toUpperCase()}</Text>
      }
    </Avatar>
  );
}

// ─── Annonces Tab ────────────────────────────────────────────────────────────

const categoryLabel: Record<string, string> = {
  dragodindes: 'Dragodindes',
  muldos: 'Muldos',
  volkornes: 'Volkornes',
};
const categoryColor: Record<string, string> = {
  dragodindes: 'teal',
  muldos: 'blue',
  volkornes: 'violet',
};

function TradeCard({ trade, onContact }: { trade: UserTrade; onContact: () => void }) {
  const { profile, listings } = trade;
  const displayName = profile.username ?? profile.fullName ?? 'Joueur';
  const [expanded, setExpanded] = useState(false);
  const speciesCount = new Set(listings.map(l => l.mountId)).size;

  const grouped = listings.reduce((acc, l) => {
    if (!acc[l.category]) acc[l.category] = [];
    acc[l.category].push(l);
    return acc;
  }, {} as Record<string, typeof listings>);

  return (
    <Paper withBorder p="md" radius="md" bg="white">
      <Stack gap="sm">
        <Group justify="space-between" align="flex-start">
          <Group gap="sm">
            <UserAvatar avatarUrl={profile.avatarUrl} name={displayName} />
            <Stack gap={0}>
              {profile.username ? (
                <Anchor component={Link as any} to={`/${profile.username}`} fw={700} size="sm" c="dark" underline="hover">
                  {displayName}
                </Anchor>
              ) : (
                <Text fw={700} size="sm">{displayName}</Text>
              )}
              <Text size="xs" c="dimmed">
                {speciesCount} espèce{speciesCount > 1 ? 's' : ''} proposée{speciesCount > 1 ? 's' : ''}
              </Text>
            </Stack>
          </Group>
          <Group gap={6}>
            <ActionIcon
              size="sm"
              variant="subtle"
              color="gray"
              onClick={() => setExpanded((v) => !v)}
              title={expanded ? 'Réduire' : 'Voir les montures'}
            >
              {expanded ? <Minus size={14} /> : <Plus size={14} />}
            </ActionIcon>
            <Button
              size="xs"
              variant="light"
              color="orange"
              leftSection={<MessageCircle size={12} />}
              onClick={onContact}
            >
              Contacter
            </Button>
          </Group>
        </Group>

        {/* Always visible: category badges */}
        <Group gap={4} wrap="wrap">
          {Object.keys(grouped).map((cat) => (
            <Badge key={cat} color={categoryColor[cat] ?? 'gray'} variant="light" size="xs">
              {categoryLabel[cat] ?? cat}
            </Badge>
          ))}
        </Group>

        {/* Expanded: full species list per category */}
        {expanded && Object.entries(grouped).map(([cat, catListings]) => (
          <Stack key={cat} gap={4}>
            <Text size="xs" fw={700} c="dimmed" tt="uppercase" lts={0.5}>{categoryLabel[cat] ?? cat}</Text>
            <Group gap={8} wrap="wrap">
              {catListings.map((l) => {
                const mount = mountMap.get(l.mountId);
                if (!mount) return null;
                return (
                  <Group key={`${l.mountId}-${l.gender}`} gap={4} wrap="nowrap">
                    {mount.sprite && (
                      <Image src={mount.sprite} alt={mount.name} w={28} h={28} fit="contain" style={{ imageRendering: 'pixelated' }} />
                    )}
                    <Stack gap={0}>
                      <Text size="xs">{mount.name}</Text>
                      <Group gap={4}>
                        <Text size="xs" fw={700} c={l.gender === 'male' ? 'blue.5' : 'pink.5'}>
                          {l.gender === 'male' ? '♂' : '♀'}
                        </Text>
                        <Text size="xs" c="dimmed">×{l.quantity}</Text>
                      </Group>
                    </Stack>
                  </Group>
                );
              })}
            </Group>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}

function AnnonceTab({ onContact, currentRealm }: { onContact: (userId: string) => void; currentRealm?: string }) {
  const { user } = useAuth();
  const { allTrades, loading } = useTrade(user?.id, currentRealm);
  const [catFilter, setCatFilter] = useState<string | null>(null);
  const [mountFilter, setMountFilter] = useState<string | null>(null);

  const afterCat = catFilter
    ? allTrades.filter((t) => t.listings.some((l) => l.category === catFilter))
    : allTrades;

  const mountOptions = [...new Map(
    afterCat.flatMap((t) => t.listings)
      .filter((l) => !catFilter || l.category === catFilter)
      .map((l) => [l.mountId, mountMap.get(l.mountId)?.name ?? l.mountId])
  ).entries()]
    .sort((a, b) => a[1].localeCompare(b[1]))
    .map(([value, label]) => ({ value, label }));

  const filtered = mountFilter
    ? afterCat.filter((t) => t.listings.some((l) => l.mountId === mountFilter))
    : afterCat;

  // Reset mount filter when category changes
  const handleCatChange = (val: string | null) => {
    setCatFilter(val);
    setMountFilter(null);
  };

  if (loading) return <Center py="xl"><Loader color="orange" /></Center>;

  return (
    <Stack gap="lg">
      <Group gap="sm" wrap="wrap">
        <Select
          placeholder="Toutes catégories"
          value={catFilter}
          onChange={handleCatChange}
          data={[
            { value: 'dragodindes', label: 'Dragodindes' },
            { value: 'muldos', label: 'Muldos' },
            { value: 'volkornes', label: 'Volkornes' },
          ]}
          clearable
          w={200}
          size="sm"
        />
        <Select
          placeholder="Toutes montures"
          value={mountFilter}
          onChange={setMountFilter}
          data={mountOptions}
          clearable
          searchable
          w={220}
          size="sm"
          disabled={mountOptions.length === 0}
        />
        <Text size="sm" c="dimmed">{filtered.length} annonce{filtered.length !== 1 ? 's' : ''}</Text>
      </Group>

      {filtered.length === 0 ? (
        <Paper withBorder p="xl" radius="md" bg="gray.0">
          <Stack align="center" gap="xs">
            <ArrowLeftRight size={32} color="var(--mantine-color-gray-4)" />
            <Text c="dimmed" ta="center" size="sm">Aucune annonce pour l'instant.</Text>
            <Text c="dimmed" ta="center" size="xs">Proposez vos montures à l'échange depuis l'onglet Inventaire.</Text>
          </Stack>
        </Paper>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="sm">
          {filtered.map((trade) => (
            <TradeCard
              key={trade.profile.userId}
              trade={trade}
              onContact={() => onContact(trade.profile.userId)}
            />
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
}

// ─── Messages Tab ─────────────────────────────────────────────────────────────

function ConversationItem({
  conv,
  currentUserId,
  profiles,
  isSelected,
  onClick,
}: {
  conv: Conversation;
  currentUserId: string;
  profiles: Map<string, { fullName?: string; avatarUrl?: string; username?: string }>;
  isSelected: boolean;
  onClick: () => void;
}) {
  const otherId = conv.participantA === currentUserId ? conv.participantB : conv.participantA;
  const other = profiles.get(otherId);
  const displayName = other?.username ?? other?.fullName ?? 'Joueur';
  const lastMsg = conv.lastMessage;

  return (
    <Paper
      withBorder
      p="sm"
      radius="md"
      onClick={onClick}
      style={{
        cursor: 'pointer',
        borderColor: isSelected ? 'var(--mantine-color-orange-4)' : undefined,
        background: isSelected ? 'var(--mantine-color-orange-0)' : undefined,
      }}
    >
      <Group gap="sm" wrap="nowrap">
        <Indicator disabled={conv.unreadCount === 0} color="red" size={8} offset={4}>
          <UserAvatar avatarUrl={other?.avatarUrl} name={displayName} size="sm" />
        </Indicator>
        <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
          <Group justify="space-between" gap="xs">
            <Text size="sm" fw={conv.unreadCount > 0 ? 700 : 500} truncate>{displayName}</Text>
            {conv.unreadCount > 0 && (
              <Badge color="red" variant="filled" size="xs">{conv.unreadCount}</Badge>
            )}
          </Group>
          {lastMsg && (
            <Text size="xs" c="dimmed" truncate>
              {lastMsg.senderId === currentUserId ? 'Vous : ' : ''}{lastMsg.content}
            </Text>
          )}
        </Stack>
      </Group>
    </Paper>
  );
}

function MessageThread({
  conversationId,
  currentUserId,
  messages,
  profiles,
  onSend,
  onBack,
}: {
  conversationId: string;
  currentUserId: string;
  messages: Map<string, import('@/hooks/useMessages').Message[]>;
  profiles: Map<string, { fullName?: string; avatarUrl?: string; username?: string }>;
  onSend: (text: string) => void;
  onBack: () => void;
}) {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const msgs = messages.get(conversationId) ?? [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs.length]);

  function handleSend() {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput('');
  }

  return (
    <Stack gap="sm" style={{ height: '100%' }}>
      <Group gap="sm">
        <ActionIcon variant="subtle" color="gray" onClick={onBack} hiddenFrom="md">
          <ArrowLeft size={18} />
        </ActionIcon>
        <Text fw={700} size="sm">Conversation</Text>
      </Group>
      <Divider />

      <ScrollArea style={{ flex: 1 }} offsetScrollbars>
        <Stack gap="xs" p="xs">
          {msgs.length === 0 && (
            <Text size="sm" c="dimmed" ta="center" py="xl">Démarrez la conversation !</Text>
          )}
          {msgs.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            const sender = profiles.get(msg.senderId);
            const senderName = sender?.username ?? sender?.fullName ?? 'Joueur';
            return (
              <Group key={msg.id} justify={isMe ? 'flex-end' : 'flex-start'} gap="xs" align="flex-end">
                {!isMe && <UserAvatar avatarUrl={sender?.avatarUrl} name={senderName} size="xs" />}
                <Stack gap={2} style={{ maxWidth: '70%' }}>
                  {!isMe && <Text size="xs" c="dimmed" pl={4}>{senderName}</Text>}
                  <Paper
                    px="sm"
                    py={6}
                    radius="md"
                    bg={isMe ? 'orange.5' : 'gray.1'}
                    style={{ borderBottomRightRadius: isMe ? 2 : undefined, borderBottomLeftRadius: isMe ? undefined : 2 }}
                  >
                    <Text size="sm" c={isMe ? 'white' : 'dark'}>{msg.content}</Text>
                  </Paper>
                  <Text size="xs" c="dimmed" ta={isMe ? 'right' : 'left'} pr={isMe ? 4 : 0} pl={isMe ? 0 : 4}>
                    {new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </Stack>
                {isMe && <UserAvatar avatarUrl={sender?.avatarUrl} name={senderName} size="xs" />}
              </Group>
            );
          })}
          <div ref={bottomRef} />
        </Stack>
      </ScrollArea>

      <Group gap="xs">
        <TextInput
          style={{ flex: 1 }}
          placeholder="Votre message..."
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          size="sm"
        />
        <ActionIcon size="lg" color="orange" variant="filled" onClick={handleSend} disabled={!input.trim()}>
          <Send size={16} />
        </ActionIcon>
      </Group>
    </Stack>
  );
}

function MessagesTab({
  initialConversationId,
}: {
  initialConversationId?: string | null;
}) {
  const { user } = useAuth();
  const { conversations, messages, profiles, fetchMessages, sendMessage } = useMessages(user?.id);
  const [selectedId, setSelectedId] = useState<string | null>(initialConversationId ?? null);

  useEffect(() => {
    if (initialConversationId) setSelectedId(initialConversationId);
  }, [initialConversationId]);

  useEffect(() => {
    if (selectedId) fetchMessages(selectedId);
  }, [selectedId]);

  if (!user) {
    return (
      <Center py="xl">
        <Text c="dimmed">Connectez-vous pour accéder à vos messages.</Text>
      </Center>
    );
  }

  return (
    <Box style={{ display: 'grid', gridTemplateColumns: selectedId ? '1fr' : '1fr', gap: 16 }}>
      <SimpleGrid cols={{ base: 1, md: selectedId ? 2 : 1 }} spacing="sm" style={{ alignItems: 'start' }}>
        {/* Conversation list */}
        <Stack gap="xs" visibleFrom={selectedId ? 'md' : undefined}>
          <Text fw={700} size="sm" c="dimmed" tt="uppercase" lts={1}>Conversations</Text>
          {conversations.length === 0 && (
            <Paper withBorder p="md" radius="md" bg="gray.0">
              <Text size="sm" c="dimmed" ta="center">Aucune conversation.</Text>
            </Paper>
          )}
          {conversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conv={conv}
              currentUserId={user.id}
              profiles={profiles}
              isSelected={conv.id === selectedId}
              onClick={() => setSelectedId(conv.id)}
            />
          ))}
        </Stack>

        {/* Thread */}
        {selectedId ? (
          <Paper withBorder p="md" radius="md" style={{ minHeight: 500, display: 'flex', flexDirection: 'column' }}>
            <MessageThread
              conversationId={selectedId}
              currentUserId={user.id}
              messages={messages}
              profiles={profiles}
              onSend={(text) => sendMessage(selectedId, text)}
              onBack={() => setSelectedId(null)}
            />
          </Paper>
        ) : (
          <Paper withBorder p="xl" radius="md" bg="gray.0" visibleFrom="md">
            <Stack align="center" gap="xs">
              <MessageCircle size={32} color="var(--mantine-color-gray-4)" />
              <Text c="dimmed" size="sm">Sélectionnez une conversation</Text>
            </Stack>
          </Paper>
        )}
      </SimpleGrid>
    </Box>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function EchangePage() {
  const { user, loading } = useAuth();
  const { profile } = useProfile(user?.id);
  const { getOrCreateConversation, unreadTotal } = useMessages(user?.id);
  const [activeTab, setActiveTab] = useState<string | null>('annonces');
  const [pendingConvId, setPendingConvId] = useState<string | null>(null);

  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;

  async function handleContact(otherUserId: string) {
    if (!user) return;
    const convId = await getOrCreateConversation(otherUserId);
    if (convId) {
      setPendingConvId(convId);
      setActiveTab('messages');
    }
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Stack gap={4}>
          <Title order={1} c="dark">Échange</Title>
          <Text c="dimmed">Trouvez des joueurs pour échanger vos montures en élevage.</Text>
        </Stack>

        <Tabs value={activeTab} onChange={setActiveTab} color="orange">
          <Tabs.List mb="lg">
            <Tabs.Tab value="annonces" leftSection={<ArrowLeftRight size={14} />}>
              Annonces
            </Tabs.Tab>
            <Tabs.Tab
              value="messages"
              leftSection={<MessageCircle size={14} />}
              rightSection={unreadTotal > 0 ? (
                <Badge color="red" variant="filled" size="xs" circle>{unreadTotal > 9 ? '9+' : unreadTotal}</Badge>
              ) : undefined}
            >
              Messages
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="annonces">
            <AnnonceTab onContact={handleContact} currentRealm={profile.realm || undefined} />
          </Tabs.Panel>

          <Tabs.Panel value="messages">
            <MessagesTab initialConversationId={activeTab === 'messages' ? pendingConvId : null} />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
}
