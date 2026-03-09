import { Stack, Group, Text, Badge, Paper, Image, Divider, NumberInput, ActionIcon, Center, TextInput, SegmentedControl, List, Collapse, UnstyledButton } from '@mantine/core';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { Lock, Search } from 'lucide-react';

import { useBreedingStore } from '@/store/useBreedingStore';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useTrade } from '@/hooks/useTrade';
import { dragodindes } from '@/data/mounts/dragodindes';
import { muldos } from '@/data/mounts/muldos';
import { volkornes } from '@/data/mounts/volkornes';

const CATEGORIES = [
  { key: 'dragodindes' as const, label: 'Dragodindes', color: 'teal', mounts: dragodindes },
  { key: 'muldos' as const, label: 'Muldos', color: 'blue', mounts: muldos },
  { key: 'volkornes' as const, label: 'Volkornes', color: 'violet', mounts: volkornes },
];

export function EchangeInventaireTab() {
  const { user } = useAuth();
  const { profile } = useProfile(user?.id);
  const inventory = useBreedingStore((s) => s.inventory);
  const setMaleCount = useBreedingStore((s) => s.setMaleCount);
  const setFemaleCount = useBreedingStore((s) => s.setFemaleCount);
  const wantedMounts = useBreedingStore((s) => s.wantedMounts);
  const setWanted = useBreedingStore((s) => s.setWanted);
  const { myListings, toggleListing } = useTrade(user?.id);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [helpOpen, setHelpOpen] = useState(true);

  if (!user) {
    return (
      <Center py="xl">
        <Paper withBorder p="xl" radius="md" ta="center" maw={400} w="100%">
          <Stack gap="sm" align="center">
            <Lock size={32} color="var(--mantine-color-gray-5)" />
            <Text fw={700} size="md">Connexion requise</Text>
            <Text size="sm" c="dimmed">
              Connectez-vous pour gérer votre inventaire et proposer vos montures à l'échange.
            </Text>
          </Stack>
        </Paper>
      </Center>
    );
  }

  function checkProfileComplete() {
    if (!profile.username || !profile.realm) {
      notifications.show({
        title: 'Profil incomplet',
        message: 'Définissez un nom public et un serveur dans votre profil pour proposer des montures à l\'échange.',
        color: 'orange',
        autoClose: 6000,
      });
      return false;
    }
    return true;
  }

  const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const normalizedSearch = normalize(search.trim());

  return (
    <Stack gap="xl">
      {/* Help banner */}
      <Paper withBorder p="md" radius="md" bg="blue.0" style={{ borderColor: 'var(--mantine-color-blue-3)' }}>
        <UnstyledButton onClick={() => setHelpOpen((o) => !o)} w="100%">
          <Group justify="space-between">
            <Group gap="xs">
              <Text fw={700} size="md" c="blue.7">Que faire ?</Text>
              <Badge color="blue" variant="light" size="sm">Guide</Badge>
            </Group>
            <Text size="sm" c="blue.5">{helpOpen ? '▲ Réduire' : '▼ Afficher'}</Text>
          </Group>
        </UnstyledButton>
        <Collapse in={helpOpen}>
          <Divider my="sm" color="blue.2" />
          <List size="sm" spacing="xs" c="dark">
            <List.Item>
              <Text size="sm">Renseignez les montures <Text component="span" fw={600} c="orange.7">fertiles </Text> que vous souhaitez proposer à l'échange en saisissant les quantités mâles (<Text component="span" fw={700} c="blue.5">♂</Text>) et femelles (<Text component="span" fw={700} c="pink.5">♀</Text>) pour chaque espèce.</Text>
            </List.Item>
            <List.Item>
              <Text size="sm">Activez les boutons <Text component="span" fw={700} c="blue.5">♂</Text> / <Text component="span" fw={700} c="pink.5">♀</Text> dans la colonne <Text component="span" fw={600}>Échange</Text> pour proposer une monture aux autres joueurs. Votre offre apparaîtra dans l'onglet <Text component="span" fw={600}>Offres</Text>.</Text>
            </List.Item>
            <List.Item>
              <Text size="sm">Un <Text component="span" fw={600}>nom public</Text> et un <Text component="span" fw={600}>serveur de jeu</Text> configurés dans votre profil sont requis pour proposer à l'échange.</Text>
            </List.Item>
            <List.Item>
              <Text size="sm">Utilisez la <Text component="span" fw={600}>barre de recherche</Text> ou les filtres de catégorie pour naviguer rapidement parmi les espèces.</Text>
            </List.Item>
          </List>
        </Collapse>
      </Paper>

      {/* Filters */}
      <Group gap="sm" wrap="wrap">
        <TextInput
          placeholder="Rechercher une monture..."
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          leftSection={<Search size={14} />}
          size="sm"
          w={220}
          styles={{ input: { minWidth: 0 } }}
        />
        <SegmentedControl
          value={catFilter}
          onChange={setCatFilter}
          size="sm"
          data={[
            { value: 'all', label: 'Toutes' },
            { value: 'dragodindes', label: 'Dragodindes' },
            { value: 'muldos', label: 'Muldos' },
            { value: 'volkornes', label: 'Volkornes' },
          ]}
        />
      </Group>

      {CATEGORIES.filter(({ key }) => catFilter === 'all' || catFilter === key).map(({ key, label, color, mounts }) => {
        const filtered = mounts
          .filter((m) => m.generation !== 0)
          .filter((m) => !normalizedSearch || normalize(m.name).includes(normalizedSearch));
        if (filtered.length === 0) return null;
        return (
        <Stack key={key} gap="sm">
          <Group gap="sm">
            <Text fw={700} size="lg" c="dark">{label}</Text>
            <Badge color={color} variant="light" size="sm">{filtered.length} espèces</Badge>
          </Group>
          <Divider color="gray.2" />
          <Stack gap={4}>
            {filtered.map((mount) => {
              const maleCount = inventory[mount.id]?.maleCount ?? 0;
              const femaleCount = inventory[mount.id]?.femaleCount ?? 0;
              const offeringMale = myListings.get(mount.id)?.has('male') ?? false;
              const offeringFemale = myListings.get(mount.id)?.has('female') ?? false;
              const wantingMale = wantedMounts[mount.id]?.male ?? false;
              const wantingFemale = wantedMounts[mount.id]?.female ?? false;
              return (
                <Paper key={mount.id} withBorder px="sm" py={8} radius="md">
                  <Group gap="sm" wrap="nowrap" justify="space-between">
                    {/* Mount info */}
                    <Group gap="sm" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                      {mount.sprite && (
                        <Image
                          src={mount.sprite}
                          alt={mount.name}
                          w={32}
                          h={32}
                          fit="contain"
                          loading="lazy"
                          style={{ imageRendering: 'pixelated', flexShrink: 0 }}
                        />
                      )}
                      <Stack gap={0} style={{ minWidth: 0 }}>
                        <Text size="sm" fw={600} truncate>{mount.name}</Text>
                        <Text size="xs" c="dimmed">Gén. {mount.generation}</Text>
                      </Stack>
                    </Group>

                    {/* Controls */}
                    <Group gap="sm" wrap="nowrap">
                      {/* Male count */}
                      <Group gap={4} wrap="nowrap" align="center">
                        <Text fw={900} c="blue.5" style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>♂</Text>
                        <NumberInput
                          value={maleCount}
                          onChange={(val) => setMaleCount(mount.id, typeof val === 'number' ? val : 0)}
                          min={0}
                          size="sm"
                          w={64}
                          allowNegative={false}
                        />
                      </Group>
                      {/* Female count */}
                      <Group gap={4} wrap="nowrap" align="center">
                        <Text fw={900} c="pink.5" style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>♀</Text>
                        <NumberInput
                          value={femaleCount}
                          onChange={(val) => setFemaleCount(mount.id, typeof val === 'number' ? val : 0)}
                          min={0}
                          size="sm"
                          w={64}
                          allowNegative={false}
                        />
                      </Group>

                      <Divider orientation="vertical" />

                      {/* Proposer toggles */}
                      <Text size="xs" c="dimmed" fw={500}>Proposer :</Text>
                      <ActionIcon
                        size="lg"
                        variant={offeringMale ? 'filled' : 'light'}
                        color="blue"
                        onClick={() => {
                          const enabling = !offeringMale;
                          if (enabling && !checkProfileComplete()) return;
                          if (enabling && maleCount === 0) {
                            notifications.show({
                              title: 'Aucun mâle en inventaire',
                              message: `Vous n'avez aucun ${mount.name} mâle fertile renseigné.`,
                              color: 'orange',
                            });
                            return;
                          }
                          toggleListing(mount.id, mount.category, 'male', enabling);
                        }}
                        title="Proposer mâle à l'échange"
                      >
                        <Text size="lg" fw={900} lh={1}>♂</Text>
                      </ActionIcon>
                      <ActionIcon
                        size="lg"
                        variant={offeringFemale ? 'filled' : 'light'}
                        color="pink"
                        onClick={() => {
                          const enabling = !offeringFemale;
                          if (enabling && !checkProfileComplete()) return;
                          if (enabling && femaleCount === 0) {
                            notifications.show({
                              title: 'Aucune femelle en inventaire',
                              message: `Vous n'avez aucune ${mount.name} femelle fertile renseignée.`,
                              color: 'orange',
                            });
                            return;
                          }
                          toggleListing(mount.id, mount.category, 'female', enabling);
                        }}
                        title="Proposer femelle à l'échange"
                      >
                        <Text size="lg" fw={900} lh={1}>♀</Text>
                      </ActionIcon>

                      <Divider orientation="vertical" />

                      {/* Rechercher toggles */}
                      <Text size="xs" c="dimmed" fw={500}>Rechercher :</Text>
                      <ActionIcon
                        size="lg"
                        variant={wantingMale ? 'filled' : 'light'}
                        color="indigo"
                        onClick={() => setWanted(mount.id, 'male', !wantingMale)}
                        title="Rechercher mâle"
                      >
                        <Text size="lg" fw={900} lh={1}>♂</Text>
                      </ActionIcon>
                      <ActionIcon
                        size="lg"
                        variant={wantingFemale ? 'filled' : 'light'}
                        color="grape"
                        onClick={() => setWanted(mount.id, 'female', !wantingFemale)}
                        title="Rechercher femelle"
                      >
                        <Text size="lg" fw={900} lh={1}>♀</Text>
                      </ActionIcon>
                    </Group>
                  </Group>
                </Paper>
              );
            })}
          </Stack>
        </Stack>
        );
      })}
    </Stack>
  );
}
