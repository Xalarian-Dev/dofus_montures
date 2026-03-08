import { useState, useEffect } from 'react';
import { Stack, Paper, Text, SegmentedControl, SimpleGrid, Image, Badge, UnstyledButton, TextInput, Modal, Group, Button, Flex, Checkbox } from '@mantine/core';
import { Trash2 } from 'lucide-react';
import { Search } from 'lucide-react';
import { GenerationAchievement, MountSpecies } from '@/types/mount';
import { useBreedingStore } from '@/store/useBreedingStore';
import { buildStrategy, buildSuccesStrategy } from '@/lib/breedingStrategy';
import { StrategyPanel } from '@/components/StrategyPanel';

interface ObjectifsPageProps {
  mounts: MountSpecies[];
  achievements?: Record<number, GenerationAchievement>;
  metaAchievement?: GenerationAchievement;
}

export function ObjectifsPage({ mounts, achievements, metaAchievement }: ObjectifsPageProps) {
  const [type, setType] = useState<'monture' | 'succes'>('monture');
  const [pendingMount, setPendingMount] = useState<MountSpecies | null>(null);
  const [pendingAchievementId, setPendingAchievementId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const { objectives, inventory, setObjective, setAllowCloning, removeObjective } = useBreedingStore();
  const category = mounts[0]?.category;
  const currentObjective = category ? objectives[category] : undefined;
  const currentObjectiveId = currentObjective?.targetType === 'monture' ? currentObjective.targetId : undefined;
  const currentSuccesId = currentObjective?.targetType === 'succes' ? currentObjective.targetId : undefined;
  const allowCloning = currentObjective?.allowCloning ?? false;

  // Sync tab to match the saved objective type once loaded from DB
  useEffect(() => {
    if (currentObjective?.targetType) setType(currentObjective.targetType);
  }, [currentObjective?.targetType]);

  const allAchievements: { id: string; achievement: GenerationAchievement; isMeta: boolean }[] = [
    ...Object.entries(achievements ?? {}).map(([gen, a]) => ({ id: `gen_${gen}`, achievement: a, isMeta: false })),
    ...(metaAchievement ? [{ id: 'meta', achievement: metaAchievement, isMeta: true }] : []),
  ];

  const breedableMounts = mounts.filter((m) => m.generation > 0);
  const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const filteredMounts = breedableMounts.filter((m) => normalize(m.name).includes(normalize(search)));

  function handleConfirmMount() {
    if (!pendingMount || !category) return;
    setObjective(category, pendingMount.id, 'monture');
    setPendingMount(null);
  }

  function handleConfirmAchievement() {
    if (!pendingAchievementId || !category) return;
    setObjective(category, pendingAchievementId, 'succes');
    setPendingAchievementId(null);
  }

  const pendingAchievement = allAchievements.find(a => a.id === pendingAchievementId);

  const displayedMounts = currentObjectiveId
    ? breedableMounts.filter((m) => m.id === currentObjectiveId)
    : filteredMounts;

  const isLocked = (targetType: 'monture' | 'succes') =>
    currentObjective !== undefined && currentObjective.targetType === targetType;

  return (
    <Stack gap="xl">
      <Flex justify="space-between" align="center" wrap="wrap" gap="sm">
        <SegmentedControl
          value={type}
          onChange={(v) => { setType(v as 'monture' | 'succes'); setSearch(''); }}
          data={[
            { label: 'Monture', value: 'monture' },
            { label: 'Succès', value: 'succes' },
          ]}
          w="fit-content"
        />
        <Group gap="sm">
          {currentObjective && (
            <Checkbox
              label="Autoriser le Clonage"
              checked={allowCloning}
              onChange={(e) => category && setAllowCloning(category, e.currentTarget.checked)}
              size="sm"
            />
          )}
          {((type === 'monture' && currentObjective?.targetType === 'monture') ||
            (type === 'succes' && currentObjective?.targetType === 'succes')) && (
            <Button
              variant="light"
              color="red"
              size="sm"
              leftSection={<Trash2 size={14} />}
              onClick={() => category && removeObjective(category)}
            >
              Retirer l'objectif
            </Button>
          )}
        </Group>
      </Flex>

      {type === 'monture' && !currentObjectiveId && (
        <TextInput
          placeholder="Rechercher une monture..."
          leftSection={<Search size={14} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          w={{ base: '100%', sm: 300 }}
        />
      )}

      {type === 'monture' && (
        <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="sm">
          {displayedMounts.map((mount) => {
            const isObjective = mount.id === currentObjectiveId;
            return (
              <UnstyledButton key={mount.id} onClick={() => !isLocked('monture') && setPendingMount(mount)}>
                <Paper
                  withBorder
                  p="md"
                  radius="md"
                  bg={isObjective ? 'orange.0' : 'white'}
                  style={{
                    borderColor: isObjective ? 'var(--mantine-color-orange-5)' : undefined,
                    transition: 'border-color 0.15s',
                    cursor: isLocked('monture') ? 'default' : 'pointer',
                  }}
                >
                  <Stack gap={6} align="center">
                    {mount.sprite && (
                      <Image
                        src={mount.sprite}
                        alt={mount.name}
                        w={72}
                        h={72}
                        fit="contain"
                        style={{ imageRendering: 'pixelated' }}
                      />
                    )}
                    <Text fw={600} size="xs" c="dark" ta="center" lh={1.3}>{mount.name}</Text>
                    <Badge color={isObjective ? 'orange' : 'gray'} variant={isObjective ? 'filled' : 'light'} size="xs">
                      {isObjective ? 'Objectif actuel' : `Gén. ${mount.generation}`}
                    </Badge>
                  </Stack>
                </Paper>
              </UnstyledButton>
            );
          })}
        </SimpleGrid>
      )}

      {type === 'succes' && (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="sm">
          {allAchievements
            .filter((a) => !currentSuccesId || a.id === currentSuccesId)
            .map(({ id, achievement, isMeta }) => {
              const isSelected = id === currentSuccesId;
              return (
                <UnstyledButton key={id} onClick={() => !isLocked('succes') && setPendingAchievementId(id)} style={{ height: '100%' }}>
                  <Paper
                    withBorder
                    p="md"
                    radius="md"
                    h="100%"
                    bg={isSelected ? 'orange.0' : 'white'}
                    style={{
                      borderColor: isSelected ? 'var(--mantine-color-orange-5)' : undefined,
                      cursor: isLocked('succes') ? 'default' : 'pointer',
                    }}
                  >
                    <Stack gap={6} justify="space-between" h="100%">
                      <Stack gap={4}>
                        <Group gap={4} wrap="wrap">
                          {isMeta && <Badge color="yellow" variant="filled" size="xs">Méta</Badge>}
                          {isSelected && <Badge color="orange" variant="filled" size="xs">Objectif actuel</Badge>}
                        </Group>
                        <Text fw={700} size="sm" lh={1.3}>{achievement.name}</Text>
                        <Text size="xs" c="dimmed" lh={1.3}>{achievement.description}</Text>
                      </Stack>
                      <Badge color="teal" variant="light" size="xs" w="fit-content">
                        {achievement.points} pts
                      </Badge>
                    </Stack>
                  </Paper>
                </UnstyledButton>
              );
            })}
        </SimpleGrid>
      )}

      {type === 'succes' && currentSuccesId && (
        <StrategyPanel strategy={buildSuccesStrategy(currentSuccesId, mounts, allowCloning, inventory)} inventory={inventory} />
      )}

      {type === 'monture' && !currentObjectiveId && filteredMounts.length === 0 && search && (
        <Paper withBorder p="xl" radius="md" bg="gray.0">
          <Text c="dimmed" ta="center" size="sm">Aucune monture trouvée pour « {search} ».</Text>
        </Paper>
      )}

      {type === 'monture' && currentObjectiveId && (
        <StrategyPanel strategy={buildStrategy([currentObjectiveId], mounts, allowCloning, inventory)} inventory={inventory} />
      )}

      <Modal
        opened={!!pendingMount}
        onClose={() => setPendingMount(null)}
        title="Définir un objectif"
        centered
        size="sm"
      >
        <Stack gap="md">
          {currentObjective?.targetType === 'succes' && (
            <Paper withBorder p="sm" radius="md" bg="yellow.0" style={{ borderColor: 'var(--mantine-color-yellow-4)' }}>
              <Text size="sm" c="yellow.8">
                Vous avez déjà un objectif Succès (<strong>{allAchievements.find(a => a.id === currentObjective.targetId)?.achievement.name}</strong>). Il sera remplacé.
              </Text>
            </Paper>
          )}
          <Text size="sm">
            Voulez-vous définir <strong>{pendingMount?.name}</strong> comme objectif monture ?
          </Text>
          <Group justify="flex-end" gap="sm">
            <Button variant="default" onClick={() => setPendingMount(null)}>Non</Button>
            <Button color="orange" onClick={handleConfirmMount}>Oui</Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={!!pendingAchievementId}
        onClose={() => setPendingAchievementId(null)}
        title="Définir un objectif"
        centered
        size="sm"
      >
        <Stack gap="md">
          {currentObjective?.targetType === 'monture' && (
            <Paper withBorder p="sm" radius="md" bg="yellow.0" style={{ borderColor: 'var(--mantine-color-yellow-4)' }}>
              <Text size="sm" c="yellow.8">
                Vous avez déjà un objectif Monture (<strong>{breedableMounts.find(m => m.id === currentObjective.targetId)?.name}</strong>). Il sera remplacé.
              </Text>
            </Paper>
          )}
          <Text size="sm">
            Voulez-vous définir <strong>{pendingAchievement?.achievement.name}</strong> comme objectif succès ?
          </Text>
          <Group justify="flex-end" gap="sm">
            <Button variant="default" onClick={() => setPendingAchievementId(null)}>Non</Button>
            <Button color="orange" onClick={handleConfirmAchievement}>Oui</Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
