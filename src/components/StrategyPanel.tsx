import { Stack, Paper, Text, Group, Badge, SimpleGrid, Image, Divider, ThemeIcon } from '@mantine/core';
import { Sword, ArrowRight, Egg, Heart, CheckCircle } from 'lucide-react';
import { BreedingStrategy } from '@/lib/breedingStrategy';
import { BreedingInventory, MountSpecies } from '@/types/mount';

interface StrategyPanelProps {
  strategy: BreedingStrategy;
  inventory?: BreedingInventory;
}

function MountChip({ mount, count, done }: { mount: MountSpecies; count?: number; done?: boolean }) {
  return (
    <Group gap={6} wrap="nowrap" opacity={done ? 0.5 : 1}>
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
        <Group gap={4}>
          <Text size="xs" fw={600} lh={1.2}>{mount.name}</Text>
          {done
            ? <CheckCircle size={14} color="#2f9e44" fill="#b2f2bb" />
            : count !== undefined && count > 1 && (
              <Badge color="red" variant="filled" size="xs">{count}</Badge>
            )}
        </Group>
        <Text size="xs" c="dimmed">Gén. {mount.generation}</Text>
      </Stack>
    </Group>
  );
}

export function StrategyPanel({ strategy, inventory }: StrategyPanelProps) {
  const { targets, captures, totalCaptures, steps, totalBreeds } = strategy;
  const remaining = targets.filter((m) => !inventory?.[m.id]?.done).length;

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
            {targets.map((m) => (
              <MountChip key={m.id} mount={m} done={inventory?.[m.id]?.done} />
            ))}
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
          <Paper withBorder p="md" radius="md" bg="white">
            <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="sm">
              {captures.map(({ mount, count }) => (
                <MountChip key={mount.id} mount={mount} count={count} />
              ))}
            </SimpleGrid>
          </Paper>
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
            {step.breeds.map(({ mount, parents, count }) => (
              <Paper key={mount.id} withBorder p="md" radius="md" bg="white">
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
                      <Text size="xs" fw={700} c="orange.7" lh={1.2}>{mount.name}</Text>
                      <Text size="xs" c="dimmed">Gén. {mount.generation}</Text>
                    </Stack>
                  </Group>
                </Group>
              </Paper>
            ))}
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
