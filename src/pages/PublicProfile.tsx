import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Title, Text, Stack, Paper, Group, Avatar, Badge, Image,
  SimpleGrid, Loader, Center, Button, Divider,
} from '@mantine/core';
import { ArrowLeft, MessageCircle, Swords, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useMessages } from '@/hooks/useMessages';
import { dragodindes } from '@/data/mounts/dragodindes';
import { muldos } from '@/data/mounts/muldos';
import { volkornes } from '@/data/mounts/volkornes';

const allMounts = [...dragodindes, ...muldos, ...volkornes];
const mountMap = new Map(allMounts.map((m) => [m.id, m]));

const categoryLabel: Record<string, string> = { dragodindes: 'Dragodindes', muldos: 'Muldos', volkornes: 'Volkornes' };
const categoryColor: Record<string, string> = { dragodindes: 'teal', muldos: 'blue', volkornes: 'violet' };

interface PublicProfileData {
  userId: string;
  username: string;
  fullName?: string;
  avatarUrl?: string;
  ingameName?: string;
}

interface Listing {
  mountId: string;
  category: string;
  gender: 'male' | 'female';
  quantity: number;
}

export default function PublicProfilePage() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { getOrCreateConversation } = useMessages(user?.id);

  const [profile, setProfile] = useState<PublicProfileData | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('user_id, username, full_name, avatar_url, ingame_name')
        .eq('username', username!)
        .maybeSingle();

      if (!profileData) { setNotFound(true); setLoading(false); return; }

      setProfile({
        userId: profileData.user_id,
        username: profileData.username,
        fullName: profileData.full_name,
        avatarUrl: profileData.avatar_url,
        ingameName: profileData.ingame_name,
      });

      const { data: listingData } = await supabase
        .from('trade_listings')
        .select('mount_id, category, gender, quantity')
        .eq('user_id', profileData.user_id)
        .order('category');

      setListings((listingData ?? []).map((l) => ({
        mountId: l.mount_id,
        category: l.category,
        gender: l.gender,
        quantity: l.quantity,
      })));
      setLoading(false);
    }
    load();
  }, [username]);

  async function handleContact() {
    if (!user || !profile) return;
    const convId = await getOrCreateConversation(profile.userId);
    if (convId) navigate('/echange');
  }

  if (loading || authLoading) return <Center py="xl"><Loader color="orange" /></Center>;

  if (!user) {
    return (
      <Container size="sm" py="xl">
        <Center py="xl">
          <Paper withBorder p="xl" radius="md" bg="gray.0" style={{ maxWidth: 400, width: '100%' }}>
            <Stack align="center" gap="md">
              <Lock size={32} color="var(--mantine-color-gray-5)" />
              <Stack align="center" gap={4}>
                <Text fw={700} size="sm" c="dark">Connexion requise</Text>
                <Text size="sm" c="dimmed" ta="center">Connectez-vous pour voir les profils des joueurs.</Text>
              </Stack>
            </Stack>
          </Paper>
        </Center>
      </Container>
    );
  }

  if (notFound) {
    return (
      <Container size="sm" py="xl">
        <Stack align="center" gap="md">
          <Text fw={700} size="lg">Joueur introuvable</Text>
          <Text c="dimmed" size="sm">Aucun profil ne correspond à « {username} ».</Text>
          <Button variant="default" leftSection={<ArrowLeft size={14} />} onClick={() => navigate(-1)}>Retour</Button>
        </Stack>
      </Container>
    );
  }

  const displayName = profile!.username ?? profile!.fullName ?? 'Joueur';
  const grouped = listings.reduce((acc, l) => {
    if (!acc[l.category]) acc[l.category] = [];
    acc[l.category].push(l);
    return acc;
  }, {} as Record<string, Listing[]>);

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <Button
          variant="subtle"
          color="gray"
          leftSection={<ArrowLeft size={14} />}
          onClick={() => navigate(-1)}
          w="fit-content"
          px={0}
        >
          Retour
        </Button>

        {/* Header */}
        <Paper withBorder p="lg" radius="md">
          <Group justify="space-between" align="flex-start">
            <Group gap="md">
              <Avatar size="xl" radius="xl">
                {profile!.avatarUrl
                  ? <img src={profile!.avatarUrl} alt={displayName} referrerPolicy="no-referrer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <Text fw={700} size="lg">{displayName[0].toUpperCase()}</Text>
                }
              </Avatar>
              <Stack gap={4}>
                <Title order={2}>{displayName}</Title>
                {profile!.ingameName && (
                  <Group gap={6}>
                    <Swords size={14} color="var(--mantine-color-dimmed)" />
                    <Text size="sm" c="dimmed">En jeu : <strong>{profile!.ingameName}</strong></Text>
                  </Group>
                )}
                <Text size="sm" c="dimmed">
                  {listings.length} annonce{listings.length !== 1 ? 's' : ''}
                </Text>
              </Stack>
            </Group>
            {user && user.id !== profile!.userId && (
              <Button
                color="orange"
                leftSection={<MessageCircle size={14} />}
                onClick={handleContact}
              >
                Contacter
              </Button>
            )}
          </Group>
        </Paper>

        {/* Listings */}
        {listings.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">Ce joueur n'a aucune annonce active.</Text>
        ) : (
          <Stack gap="md">
            {Object.entries(grouped).map(([cat, catListings]) => (
              <Paper key={cat} withBorder p="md" radius="md">
                <Stack gap="sm">
                  <Badge color={categoryColor[cat] ?? 'gray'} variant="light" size="sm" w="fit-content">
                    {categoryLabel[cat] ?? cat}
                  </Badge>
                  <Divider />
                  <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="sm">
                    {catListings.map((l) => {
                      const mount = mountMap.get(l.mountId);
                      if (!mount) return null;
                      return (
                        <Group key={`${l.mountId}-${l.gender}`} gap="sm" wrap="nowrap">
                          {mount.sprite && (
                            <Image src={mount.sprite} alt={mount.name} w={36} h={36} fit="contain" loading="lazy" style={{ imageRendering: 'pixelated', flexShrink: 0 }} />
                          )}
                          <Stack gap={0}>
                            <Text size="sm" fw={600}>{mount.name}</Text>
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
                  </SimpleGrid>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
