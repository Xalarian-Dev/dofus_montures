import { Stack, Paper, Text, Group, Badge, SimpleGrid, Image, Divider, ThemeIcon, Checkbox, Switch } from '@mantine/core';
import { useState } from 'react';
import { Sword, ArrowRight, Egg, Heart } from 'lucide-react';
import { BreedingStrategy } from '@/lib/breedingStrategy';
import { MountSpecies } from '@/types/mount';
import { useBreedingStore } from '@/store/useBreedingStore';

interface StrategyPanelProps {
  strategy: BreedingStrategy;
}

function MountChip({ mount }: { mount: MountSpecies }) {
  return (
    <Group gap={6} wrap="nowrap">
      {mount.sprite && (
        <Image
          src={mount.sprite}
          alt={mount.name}
          w={32}
          h={32}
          fit="contain"
          style={{ imageRendering: 'pixelated' }}
        />
      )}
      <Stack gap={0}>
        <Text size="xs" fw={600} lh={1.2}>{mount.name}</Text>
        <Text size="xs" c="dimmed">Gén. {mount.generation}</Text>
      </Stack>
    </Group>
  );
}

export function StrategyPanel({ strategy }: StrategyPanelProps) {
  const { targets, captures, totalCaptures, steps, totalBreeds } = strategy;
  const inventory = useBreedingStore((s) => s.inventory);
  const setDone = useBreedingStore((s) => s.setDone);
  const [hideDone, setHideDone] = useState(false);

  const remaining = targets.filter((m) => !inventory[m.id]?.done).length;

  return (
    <Stack gap="lg">
      {/* Summary header */}
      <Paper withBorder p="md" radius="md" bg="orange.0" style={{ borderColor: 'var(--mantine-color-orange-4)' }}>
        <Group gap="xs" mb="xs">
          <ThemeIcon color="orange" variant="light" size="sm" radius="xl">
            <Egg size={12} />
          </ThemeIcon>
          <Text fw={700} size="sm">
            {targets.length === 1
              ? `Objectif : ${targets[0].name}`
              : `Objectif : ${remaining} / ${targets.length} montures restantes`}
          </Text>
        </Group>
        {targets.length > 1 && (
          <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="xs" mb="xs">
            {targets.map((m) => {
              const done = inventory[m.id]?.done ?? false;
              return (
                <Group key={m.id} gap={6} wrap="nowrap" opacity={done ? 0.5 : 1}>
                  <MountChip mount={m} />
                  {done && <Text size="xs" c="green.6">✓</Text>}
                </Group>
              );
            })}
          </SimpleGrid>
        )}
        <Group gap="xs" mt="xs">
          <Badge color="teal" variant="light" size="sm" leftSection={<Sword size={10} />}>
            {totalCaptures} capture{totalCaptures > 1 ? 's' : ''}
          </Badge>
          <Badge color="violet" variant="light" size="sm" leftSection={<Heart size={10} />}>
            {totalBreeds} accouplement{totalBreeds > 1 ? 's' : ''}
          </Badge>
          {steps.map((s) => (
            <Badge key={s.generation} color="gray" variant="light" size="sm">
              Gén. {s.generation} : {s.totalCount}×
            </Badge>
          ))}
        </Group>
      </Paper>

      {/* Hide done toggle */}
      <Group justify="flex-end">
        <Switch
          size="xs"
          label="Masquer les étapes terminées"
          checked={hideDone}
          onChange={(e) => setHideDone(e.currentTarget.checked)}
        />
      </Group>

      {/* Captures */}
      {captures.length > 0 && (
        <Stack gap="xs">
          <Group gap="xs">
            <ThemeIcon color="teal" variant="light" size="sm" radius="xl">
              <Sword size={12} />
            </ThemeIcon>
            <Text fw={700} size="sm">Étape 1 — Captures</Text>
            <Badge color="teal" variant="light" size="xs">
              {totalCaptures} individu{totalCaptures > 1 ? 's' : ''} ({captures.length} espèce{captures.length > 1 ? 's' : ''})
            </Badge>
          </Group>
          <Stack gap="xs">
            {captures.filter(({ mount }) => !hideDone || !inventory[mount.id]?.done).map(({ mount }) => {
              const done = inventory[mount.id]?.done ?? false;
              return (
                <Paper
                  key={mount.id}
                  withBorder
                  p="sm"
                  radius="md"
                  bg={done ? 'green.0' : 'white'}
                  style={{ borderColor: done ? 'var(--mantine-color-green-4)' : undefined }}
                >
                  <Group justify="space-between" wrap="nowrap">
                    <MountChip mount={mount} />
                    <Checkbox
                      size="xs"
                      color="green"
                      checked={done}
                      onChange={(e) => setDone(mount.id, e.currentTarget.checked)}
                      label={done ? 'Obtenu' : 'À capturer'}
                    />
                  </Group>
                </Paper>
              );
            })}
          </Stack>
        </Stack>
      )}

      {/* Breeding steps */}
      {steps.map((step, i) => (
        <Stack key={step.generation} gap="xs">
          <Group gap="xs">
            <ThemeIcon color="violet" variant="light" size="sm" radius="xl">
              <Egg size={12} />
            </ThemeIcon>
            <Text fw={700} size="sm">
              Étape {captures.length > 0 ? i + 2 : i + 1} — Génération {step.generation}
            </Text>
            <Badge color="violet" variant="light" size="xs">
              {step.totalCount} accouplement{step.totalCount > 1 ? 's' : ''}
            </Badge>
          </Group>
          <Stack gap="xs">
            {step.breeds.filter(({ mount }) => !hideDone || !inventory[mount.id]?.done).map(({ mount, parents, count }) => {
              const done = inventory[mount.id]?.done ?? false;
              return (
                <Paper
                  key={mount.id}
                  withBorder
                  p="md"
                  radius="md"
                  bg={done ? 'green.0' : 'white'}
                  style={{ borderColor: done ? 'var(--mantine-color-green-4)' : undefined }}
                >
                  <Group justify="space-between" wrap="nowrap" align="center">
                    <Group gap="sm" wrap="wrap" align="center">
                      {count > 1 && (
                        <Badge color="red" variant="filled" size="sm">{count}×</Badge>
                      )}
                      <MountChip mount={parents[0]} />
                      <Text c="dimmed" size="sm">+</Text>
                      <MountChip mount={parents[1]} />
                      <ArrowRight size={16} color="var(--mantine-color-gray-5)" style={{ flexShrink: 0 }} />
                      <Group gap={6} wrap="nowrap">
                        {mount.sprite && (
                          <Image
                            src={mount.sprite}
                            alt={mount.name}
                            w={32}
                            h={32}
                            fit="contain"
                            style={{ imageRendering: 'pixelated' }}
                          />
                        )}
                        <Stack gap={0}>
                          <Text size="xs" fw={700} c={done ? 'green.7' : 'orange.7'} lh={1.2}>{mount.name}</Text>
                          <Text size="xs" c="dimmed">Gén. {mount.generation}</Text>
                        </Stack>
                      </Group>
                    </Group>
                    <Checkbox
                      size="xs"
                      color="green"
                      checked={done}
                      onChange={(e) => setDone(mount.id, e.currentTarget.checked)}
                      label={done ? 'Obtenu' : 'À élever'}
                      style={{ flexShrink: 0 }}
                    />
                  </Group>
                </Paper>
              );
            })}
          </Stack>
          {i < steps.length - 1 && <Divider />}
        </Stack>
      ))}

      {steps.length === 0 && captures.length > 0 && (
        <Paper withBorder p="md" radius="md" bg="gray.0">
          <Text size="sm" c="dimmed" ta="center">Aucun accouplement nécessaire — capture uniquement.</Text>
        </Paper>
      )}
    </Stack>
  );
}
