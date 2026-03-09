import { Stack, Group, Text, Badge, Paper, SimpleGrid, Image, Divider, List, Collapse, UnstyledButton, Checkbox, Tooltip } from '@mantine/core';
import { useState } from 'react';

import { GenerationAchievement, MountSpecies } from '@/types/mount';
import { useBreedingStore } from '@/store/useBreedingStore';

interface ResumeTabProps {
  mounts: MountSpecies[];
  achievements?: Record<number, GenerationAchievement>;
  metaAchievement?: GenerationAchievement;
}

export function ResumeTab({ mounts, achievements, metaAchievement }: ResumeTabProps) {
  const inventory = useBreedingStore((state) => state.inventory);
  const setDone = useBreedingStore((state) => state.setDone);
  const [helpOpen, setHelpOpen] = useState(true);
  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set());

  function toggleParents(mountId: string) {
    setExpandedParents((prev) => {
      const next = new Set(prev);
      if (next.has(mountId)) next.delete(mountId);
      else next.add(mountId);
      return next;
    });
  }

  const generations = mounts.reduce((acc, mount) => {
    if (!acc[mount.generation]) acc[mount.generation] = [];
    acc[mount.generation].push(mount);
    return acc;
  }, {} as Record<number, MountSpecies[]>);

  const maxGeneration = Math.max(...Object.keys(generations).map(Number));

  const getMount = (id: string) => mounts.find((m) => m.id === id);
  const getMountName = (id: string) => getMount(id)?.name || id;

  return (
    <Stack gap="xl">
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
              <Text size="sm">Cochez <Text component="span" fw={600}>"Fait"</Text> sur chaque monture déjà obtenue. Ces informations alimentent le suivi des succès.</Text>
            </List.Item>
            <List.Item>
              <Text size="sm"><Text component="span" fw={600}>Génération 1</Text> — Montures de base, obtenues par <Text component="span" c="teal.6" fw={600}>capture</Text> dans le monde du jeu. Elles ne nécessitent pas de parents.</Text>
            </List.Item>
            <List.Item>
              <Text size="sm"><Text component="span" fw={600}>Générations supérieures</Text> — S'obtiennent uniquement par <Text component="span" fw={600}>croisement</Text> des deux parents indiqués sur la carte. Un mâle et une femelle sont nécessaires.</Text>
            </List.Item>
            <List.Item>
              <Text size="sm">Les <Text component="span" fw={600}>succès</Text> se débloquent automatiquement lorsque toutes les montures d'une génération (ou de toute la catégorie) sont marquées « Fait ».</Text>
            </List.Item>
            <List.Item>
              <Text size="sm">Pour renseigner vos quantités fertiles et proposer des montures à l'échange, rendez-vous dans <Text component="span" fw={600}>Échange → Inventaire</Text>.</Text>
            </List.Item>
            <List.Item>
              <Text size="sm">Consultez l'onglet <Text component="span" fw={600}>Objectifs</Text> pour générer une stratégie d'élevage optimisée vers une monture ou un succès cible.</Text>
            </List.Item>
          </List>
        </Collapse>
      </Paper>

      {Array.from({ length: maxGeneration }, (_, i) => i + 1).map((gen) => (
        <Stack key={gen} gap="sm">
          <Group gap="sm" mb={4} justify="space-between" wrap="nowrap">
            <Group gap="sm">
              <Text fw={700} size="lg" c="dark">Génération {gen}</Text>
              {gen === 1 && <Badge color="gray" variant="light" size="sm">Montures de base</Badge>}
            </Group>
            {achievements?.[gen] && (() => {
              const achievement = achievements[gen];
              const genMounts = generations[gen] ?? [];
              const unlocked = genMounts.length > 0 && genMounts.every((m) => inventory[m.id]?.done);
              return (
                <Tooltip label={achievement.description} withArrow position="top-end">
                  <Paper
                    withBorder
                    px="sm"
                    py={6}
                    radius="md"
                    style={{
                      borderColor: unlocked ? 'var(--mantine-color-yellow-5)' : 'var(--mantine-color-gray-3)',
                      background: unlocked ? 'linear-gradient(135deg, #fef9c3, #fde68a)' : undefined,
                      opacity: unlocked ? 1 : 0.45,
                      cursor: 'default',
                      flexShrink: 0,
                    }}
                  >
                    <Group gap="xs" wrap="nowrap">
                      <Text size="sm">{unlocked ? '👑' : '🏆'}</Text>
                      <Stack gap={0}>
                        <Text size="xs" fw={700} c={unlocked ? 'yellow.8' : 'dimmed'} lh={1.2}>{achievement.name}</Text>
                        <Text size="xs" c={unlocked ? 'yellow.7' : 'dimmed'}>{achievement.points} pts</Text>
                      </Stack>
                    </Group>
                  </Paper>
                </Tooltip>
              );
            })()}
          </Group>
          <Divider color="gray.2" mb="xs" />

          <SimpleGrid cols={{ base: 1, sm: 2, xl: 3 }} spacing="sm">
            {generations[gen]?.map((mount) => {
              const done = inventory[mount.id]?.done ?? false;
              return (
                <Paper
                  key={mount.id}
                  withBorder
                  p="sm"
                  radius="md"
                  bg={done ? 'green.0' : 'white'}
                  style={{ borderColor: done ? 'var(--mantine-color-green-4)' : undefined, opacity: done ? 0.8 : 1, position: 'relative' }}
                >
                  <Checkbox
                    label="Fait"
                    size="xs"
                    color="green"
                    checked={done}
                    onChange={(e) => setDone(mount.id, e.currentTarget.checked)}
                    style={{ position: 'absolute', top: 8, right: 8 }}
                  />
                  <Stack gap="sm" align="center" py="xs">
                    {/* Sprite */}
                    {mount.sprite && (
                      <Image
                        src={mount.sprite}
                        alt={mount.name}
                        w={60}
                        h={60}
                        fit="contain"
                        loading="lazy"
                        style={{ imageRendering: 'pixelated' }}
                      />
                    )}

                    {/* Name */}
                    <Text fw={600} size="sm" c="dark" ta="center">{mount.name}</Text>

                    {/* Parents */}
                    {mount.parents && mount.parents.length > 0 ? (
                      <Stack gap={6} align="center" w="100%">
                        <Text size="xs" tt="uppercase" fw={700} c="dimmed" lts={1}>Parents requis</Text>
                        {(expandedParents.has(mount.id) ? mount.parents : mount.parents.slice(0, 1)).map(([parentA, parentB], i) => {
                          const mA = getMount(parentA);
                          const mB = getMount(parentB);
                          return (
                            <Group key={i} gap={4} justify="center" wrap="wrap">
                              <Group gap={4} wrap="nowrap">
                                {mA?.sprite && <Image src={mA.sprite} alt={mA.name} w={24} h={24} fit="contain" loading="lazy" style={{ imageRendering: 'pixelated', flexShrink: 0 }} />}
                                <Text size="xs" c="dark">{getMountName(parentA)}</Text>
                              </Group>
                              <Text size="xs" c="dimmed">+</Text>
                              <Group gap={4} wrap="nowrap">
                                {mB?.sprite && <Image src={mB.sprite} alt={mB.name} w={24} h={24} fit="contain" loading="lazy" style={{ imageRendering: 'pixelated', flexShrink: 0 }} />}
                                <Text size="xs" c="dark">{getMountName(parentB)}</Text>
                              </Group>
                            </Group>
                          );
                        })}
                        {mount.parents.length > 1 && (
                          <UnstyledButton
                            onClick={() => toggleParents(mount.id)}
                            style={{
                              padding: '2px 8px',
                              borderRadius: 4,
                              background: 'var(--mantine-color-gray-1)',
                              border: '1px solid var(--mantine-color-gray-3)',
                            }}
                          >
                            <Text size="xs" c="dimmed" fw={600}>
                              {expandedParents.has(mount.id)
                                ? '▲ Masquer'
                                : `▼ +${mount.parents.length - 1} combinaison${mount.parents.length > 2 ? 's' : ''}`}
                            </Text>
                          </UnstyledButton>
                        )}
                      </Stack>
                    ) : (
                      <Text size="xs" c="dimmed" fs="italic">Capture</Text>
                    )}
                  </Stack>
                </Paper>
              );
            })}
          </SimpleGrid>
        </Stack>
      ))}

      {metaAchievement && (() => {
        const unlocked = mounts.length > 0 && mounts.every((m) => inventory[m.id]?.done);
        return (
          <Tooltip label={metaAchievement.description} withArrow position="top">
            <Paper
              withBorder
              p="md"
              radius="md"
              style={{
                borderColor: unlocked ? 'var(--mantine-color-yellow-5)' : 'var(--mantine-color-gray-3)',
                background: unlocked ? 'linear-gradient(135deg, #fef9c3, #fde68a)' : undefined,
                opacity: unlocked ? 1 : 0.45,
                cursor: 'default',
              }}
            >
              <Group gap="sm" wrap="nowrap">
                <Text size="xl">{unlocked ? '👑' : '🏆'}</Text>
                <Stack gap={0}>
                  <Text fw={700} size="sm" c={unlocked ? 'yellow.8' : 'dimmed'}>{metaAchievement.name}</Text>
                  <Text size="xs" c={unlocked ? 'yellow.7' : 'dimmed'}>Succès méta — {metaAchievement.points} pts</Text>
                </Stack>
                {unlocked && <Badge color="yellow" variant="filled" ml="auto">Débloqué !</Badge>}
              </Group>
            </Paper>
          </Tooltip>
        );
      })()}
    </Stack>
  );
}
