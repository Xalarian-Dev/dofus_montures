import { Container, Stack, Title, Text, Tabs, TextInput, SimpleGrid, Paper, Image, Badge, Group, Divider, Collapse, Button, Chip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { MountSpecies, MountStats } from '@/types/mount';
import { dragodindes } from '@/data/mounts/dragodindes';
import { muldos } from '@/data/mounts/muldos';
import { volkornes } from '@/data/mounts/volkornes';

const STAT_LABELS: Record<keyof MountStats, string> = {
  vitalite: 'Vitalité',
  force: 'Force',
  intelligence: 'Intelligence',
  agilite: 'Agilité',
  chance: 'Chance',
  initiative: 'Initiative',
  prospection: 'Prospection',
  invocations: 'Invocations',
  soins: 'Soins',
  puissance: 'Puissance',
  critique: 'Critique',
  portee: 'Portée',
  resistance: 'Résistance',
  resistanceFeu: 'Rés. Feu',
  resistanceEau: 'Rés. Eau',
  resistanceTerre: 'Rés. Terre',
  resistanceAir: 'Rés. Air',
  renvoi: 'Renvoi',
  tacle: 'Tacle',
  fuite: 'Fuite',
  esquivePA: 'Esquive PA',
  esquivePM: 'Esquive PM',
  dommagesCritiques: 'Dmg Critiques',
  dommagesTerre: 'Dmg Terre',
  dommagesFeu: 'Dmg Feu',
  dommagesEau: 'Dmg Eau',
  dommagesAir: 'Dmg Air',
  pa: 'PA',
  pm: 'PM',
  dommagesPoussee:     'Dmg Poussée',
  resistancesPoussee:  'Rés. Poussée',
  retraitPA:           'Retrait PA',
  retraitPM:           'Retrait PM',
  resistancesCritiques:'Rés. Critiques',
};

const STAT_KEYS = Object.keys(STAT_LABELS) as (keyof MountStats)[];

const STAT_COLORS: Record<keyof MountStats, { bg: string; text: string }> = {
  vitalite:          { bg: 'var(--mantine-color-red-1)',    text: 'var(--mantine-color-red-8)' },
  force:             { bg: 'var(--mantine-color-brown-1)',  text: 'var(--mantine-color-brown-8)' },
  intelligence:      { bg: 'var(--mantine-color-orange-1)', text: 'var(--mantine-color-orange-8)' },
  agilite:           { bg: 'var(--mantine-color-green-1)',  text: 'var(--mantine-color-green-8)' },
  chance:            { bg: 'var(--mantine-color-blue-1)',   text: 'var(--mantine-color-blue-8)' },
  initiative:        { bg: 'var(--mantine-color-violet-1)', text: 'var(--mantine-color-violet-8)' },
  prospection:       { bg: 'var(--mantine-color-teal-1)',   text: 'var(--mantine-color-teal-8)' },
  invocations:       { bg: 'var(--mantine-color-orange-1)', text: 'var(--mantine-color-orange-8)' },
  soins:             { bg: 'var(--mantine-color-pink-1)',   text: 'var(--mantine-color-pink-8)' },
  puissance:         { bg: 'var(--mantine-color-yellow-1)', text: 'var(--mantine-color-yellow-8)' },
  critique:          { bg: 'var(--mantine-color-red-2)',    text: 'var(--mantine-color-red-8)' },
  portee:            { bg: 'var(--mantine-color-indigo-1)', text: 'var(--mantine-color-indigo-8)' },
  resistance:        { bg: 'var(--mantine-color-gray-2)',   text: 'var(--mantine-color-gray-8)' },
  resistanceFeu:     { bg: 'var(--mantine-color-orange-1)', text: 'var(--mantine-color-orange-8)' },
  resistanceEau:     { bg: 'var(--mantine-color-blue-1)',   text: 'var(--mantine-color-blue-8)' },
  resistanceTerre:   { bg: 'var(--mantine-color-brown-1)',  text: 'var(--mantine-color-brown-8)' },
  resistanceAir:     { bg: 'var(--mantine-color-green-1)',  text: 'var(--mantine-color-green-8)' },
  renvoi:            { bg: 'var(--mantine-color-grape-2)',  text: 'var(--mantine-color-grape-8)' },
  tacle:             { bg: 'var(--mantine-color-dark-1)',   text: 'var(--mantine-color-dark-7)' },
  fuite:             { bg: 'var(--mantine-color-gray-1)',   text: 'var(--mantine-color-gray-7)' },
  esquivePA:         { bg: 'var(--mantine-color-blue-1)',   text: 'var(--mantine-color-blue-8)' },
  esquivePM:         { bg: 'var(--mantine-color-green-1)',  text: 'var(--mantine-color-green-8)' },
  dommagesCritiques: { bg: 'var(--mantine-color-yellow-1)', text: 'var(--mantine-color-yellow-8)' },
  dommagesTerre:     { bg: 'var(--mantine-color-brown-1)',  text: 'var(--mantine-color-brown-8)' },
  dommagesFeu:       { bg: 'var(--mantine-color-orange-1)', text: 'var(--mantine-color-orange-8)' },
  dommagesEau:       { bg: 'var(--mantine-color-blue-1)',   text: 'var(--mantine-color-blue-8)' },
  dommagesAir:       { bg: 'var(--mantine-color-green-1)',  text: 'var(--mantine-color-green-8)' },
  pa:                  { bg: 'var(--mantine-color-blue-1)',   text: 'var(--mantine-color-blue-8)' },
  pm:                  { bg: 'var(--mantine-color-green-1)',  text: 'var(--mantine-color-green-8)' },
  dommagesPoussee:     { bg: 'var(--mantine-color-gray-2)',   text: 'var(--mantine-color-gray-8)' },
  resistancesPoussee:  { bg: 'var(--mantine-color-gray-2)',   text: 'var(--mantine-color-gray-8)' },
  retraitPA:           { bg: 'var(--mantine-color-blue-1)',   text: 'var(--mantine-color-blue-8)' },
  retraitPM:           { bg: 'var(--mantine-color-green-1)',  text: 'var(--mantine-color-green-8)' },
  resistancesCritiques:{ bg: 'var(--mantine-color-red-1)',    text: 'var(--mantine-color-red-8)' },
};

const STAT_ICONS: Partial<Record<keyof MountStats, string>> = {
  vitalite:          '/assets/stats/vitalite.png',
  force:             '/assets/stats/force.png',
  intelligence:      '/assets/stats/intelligence.png',
  agilite:           '/assets/stats/agilite.png',
  chance:            '/assets/stats/chance.png',
  initiative:        '/assets/stats/initiative.png',
  prospection:       '/assets/stats/prospection.png',
  soins:             '/assets/stats/soins.png',
  puissance:         '/assets/stats/puissance.png',
  critique:          '/assets/stats/critique.png',
  portee:            '/assets/stats/portee.png',
  resistance:        '/assets/stats/resistance.png',
  resistanceFeu:     '/assets/stats/perfeu.png',
  resistanceEau:     '/assets/stats/pereau.png',
  resistanceTerre:   '/assets/stats/perterre.png',
  resistanceAir:     '/assets/stats/perair.png',
  renvoi:            '/assets/stats/renvoi.png',
  tacle:             '/assets/stats/tacle.png',
  fuite:             '/assets/stats/fuite.png',
  esquivePA:         '/assets/stats/esquive-pa.png',
  esquivePM:         '/assets/stats/esquive-pm.png',
  dommagesCritiques: '/assets/stats/docri.png',
  dommagesTerre:     '/assets/stats/dommages-terre.png',
  dommagesFeu:       '/assets/stats/dommages-feu.png',
  dommagesEau:       '/assets/stats/dommages-eau.png',
  dommagesAir:       '/assets/stats/dommages-air.png',
  pa:                  '/assets/stats/pa.png',
  pm:                  '/assets/stats/pm.png',
  invocations:         '/assets/stats/invocations.png',
  dommagesPoussee:     '/assets/stats/dommages-poussee.png',
  resistancesPoussee:  '/assets/stats/resistances-poussee.png',
  retraitPA:           '/assets/stats/retrait-pa.png',
  retraitPM:           '/assets/stats/retrait-pm.png',
  resistancesCritiques:'/assets/stats/resistances-critiques.png',
};

const CATEGORIES = [
  { value: 'dragodindes', label: 'Dragodindes', mounts: dragodindes, color: 'teal' as const },
  { value: 'muldos', label: 'Muldos', mounts: muldos, color: 'blue' as const },
  { value: 'volkornes', label: 'Volkornes', mounts: volkornes, color: 'red' as const },
];

// Regroupement des caractéristiques pour le bloc de filtres (toutes les clés de STAT_LABELS y figurent).
const STAT_GROUPS: { label: string; stats: (keyof MountStats)[] }[] = [
  { label: 'Principales', stats: ['vitalite', 'force', 'intelligence', 'agilite', 'chance', 'initiative', 'prospection'] },
  { label: 'Combat', stats: ['pa', 'pm', 'portee', 'invocations', 'soins', 'puissance', 'critique', 'dommagesCritiques'] },
  { label: 'Dommages', stats: ['dommagesTerre', 'dommagesFeu', 'dommagesEau', 'dommagesAir', 'dommagesPoussee'] },
  { label: 'Résistances', stats: ['resistance', 'resistanceTerre', 'resistanceFeu', 'resistanceEau', 'resistanceAir', 'resistancesPoussee', 'resistancesCritiques'] },
  { label: 'Esquive, retrait et mobilité', stats: ['esquivePA', 'esquivePM', 'retraitPA', 'retraitPM', 'tacle', 'fuite', 'renvoi'] },
];

const PERCENT_STATS = new Set<keyof MountStats>(['critique', 'resistance', 'resistanceFeu', 'resistanceEau', 'resistanceTerre', 'resistanceAir']);

function StatBadge({ stat, value }: { stat: keyof MountStats; value: number }) {
  const icon = STAT_ICONS[stat];
  const { bg, text } = STAT_COLORS[stat];
  const isPercent = PERCENT_STATS.has(stat);
  return (
    <Group gap={4} wrap="nowrap" align="center"
      style={{ background: bg, borderRadius: 6, padding: '2px 6px' }}
    >
      {icon && <img src={icon} alt={STAT_LABELS[stat]} width={14} height={14} style={{ imageRendering: 'pixelated', flexShrink: 0 }} />}
      <Text size="xs" fw={600} style={{ color: text }}>{isPercent ? `${value}%` : `+${value}`}</Text>
      <Text size="xs" style={{ color: text, opacity: 0.8 }}>{STAT_LABELS[stat]}</Text>
    </Group>
  );
}

function MountCard({ mount }: { mount: MountSpecies }) {
  const statEntries = STAT_KEYS.filter((k) => mount.stats?.[k] !== undefined);

  return (
    <Paper withBorder p="sm" radius="md" bg="white">
      <Group gap="sm" wrap="nowrap" align="flex-start">
        {mount.sprite && (
          <Image
            src={mount.sprite}
            alt={mount.name}
            w={48}
            h={48}
            fit="contain"
            loading="lazy"
            style={{ imageRendering: 'pixelated', flexShrink: 0 }}
          />
        )}
        <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
          <Group gap="xs" wrap="nowrap">
            <Text fw={600} size="sm" c="dark" style={{ flex: 1, minWidth: 0 }} truncate>{mount.name}</Text>
            <Badge color="gray" variant="light" size="xs" style={{ flexShrink: 0 }}>Gén. {mount.generation}</Badge>
          </Group>
          {statEntries.length > 0 ? (
            <Group gap={4} wrap="wrap">
              {statEntries.map((stat) => (
                <StatBadge key={stat} stat={stat} value={mount.stats![stat]!} />
              ))}
            </Group>
          ) : (
            <Text size="xs" c="dimmed" fs="italic">Aucune statistique renseignée</Text>
          )}
        </Stack>
      </Group>
    </Paper>
  );
}

function filterMounts(mounts: MountSpecies[], nameFilter: string, statFilter: string[]) {
  return mounts.filter((m) => {
    if (nameFilter && !m.name.toLowerCase().includes(nameFilter.toLowerCase())) return false;
    if (statFilter.length > 0 && !statFilter.every((s) => m.stats?.[s as keyof MountStats] !== undefined)) return false;
    return true;
  });
}

function CategoryTab({ mounts, nameFilter, statFilter }: {
  mounts: MountSpecies[];
  nameFilter: string;
  statFilter: string[];
}) {
  const filtered = useMemo(() => filterMounts(mounts, nameFilter, statFilter), [mounts, nameFilter, statFilter]);

  const generations = useMemo(() => {
    return filtered.reduce((acc, mount) => {
      if (!acc[mount.generation]) acc[mount.generation] = [];
      acc[mount.generation].push(mount);
      return acc;
    }, {} as Record<number, MountSpecies[]>);
  }, [filtered]);

  const genKeys = Object.keys(generations).map(Number).sort((a, b) => a - b);

  if (filtered.length === 0) {
    return (
      <Text c="dimmed" fs="italic" ta="center" py="xl">Aucune monture ne correspond aux filtres.</Text>
    );
  }

  return (
    <Stack gap="xl">
      {genKeys.map((gen) => (
        <Stack key={gen} gap="sm">
          <Group gap="sm" mb={4}>
            <Text fw={700} size="lg" c="dark">Génération {gen}</Text>
            {gen === 1 && <Badge color="gray" variant="light" size="sm">Montures de base</Badge>}
          </Group>
          <Divider color="gray.2" mb="xs" />
          <SimpleGrid cols={{ base: 1, sm: 2, xl: 3 }} spacing="sm">
            {generations[gen].map((mount) => (
              <MountCard key={mount.id} mount={mount} />
            ))}
          </SimpleGrid>
        </Stack>
      ))}
    </Stack>
  );
}

export default function Caracteristiques() {
  const [nameFilter, setNameFilter] = useState('');
  const [statFilter, setStatFilter] = useState<string[]>([]);

  const [filtersOpened, { toggle: toggleFilters }] = useDisclosure(false);

  const counts = useMemo(() =>
    Object.fromEntries(CATEGORIES.map((cat) => [cat.value, filterMounts(cat.mounts, nameFilter, statFilter).length])),
    [nameFilter, statFilter]
  );

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Stack gap={4}>
          <Title order={1} c="dark">Caractéristiques</Title>
          <Text c="dimmed">Statistiques de toutes les montures au niveau maximum.</Text>
        </Stack>

        {/* Filtres */}
        <Stack gap="sm">
          <Group gap="sm" align="center">
            <TextInput
              placeholder="Rechercher une monture..."
              leftSection={<Search size={14} />}
              value={nameFilter}
              onChange={(e) => setNameFilter(e.currentTarget.value)}
              style={{ flex: 1, maxWidth: 320 }}
            />
            <Button
              variant={statFilter.length > 0 ? 'light' : 'default'}
              leftSection={<SlidersHorizontal size={14} />}
              rightSection={filtersOpened ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              onClick={toggleFilters}
              aria-expanded={filtersOpened}
              aria-controls="filtres-caracteristiques"
            >
              Filtrer par caractéristiques{statFilter.length > 0 ? ` (${statFilter.length})` : ''}
            </Button>
            {statFilter.length > 0 && (
              <Button variant="subtle" color="gray" onClick={() => setStatFilter([])}>
                Vider les filtres
              </Button>
            )}
          </Group>

          <Collapse in={filtersOpened} id="filtres-caracteristiques">
            <Paper withBorder p="md" radius="md" bg="white">
              <Chip.Group multiple value={statFilter} onChange={setStatFilter}>
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                  {STAT_GROUPS.map((group) => (
                    <Stack key={group.label} gap="xs">
                      <Text fw={700} size="sm" c="dark">{group.label}</Text>
                      <Group gap={6}>
                        {group.stats.map((stat) => (
                          <Chip key={stat} value={stat} size="xs" variant="outline">
                            <Group gap={4} wrap="nowrap" component="span">
                              {STAT_ICONS[stat] && (
                                <img src={STAT_ICONS[stat]} alt="" width={14} height={14} style={{ imageRendering: 'pixelated', flexShrink: 0 }} />
                              )}
                              {STAT_LABELS[stat]}
                            </Group>
                          </Chip>
                        ))}
                      </Group>
                    </Stack>
                  ))}
                </SimpleGrid>
              </Chip.Group>
            </Paper>
          </Collapse>
        </Stack>

        <Tabs defaultValue="dragodindes">
          <Tabs.List mb="lg">
            {CATEGORIES.map((cat) => (
              <Tabs.Tab key={cat.value} value={cat.value} color={cat.color}>
                <Group gap={6} wrap="nowrap">
                  {cat.label}
                  <Badge size="sm" color="gray" variant="filled" style={{ minWidth: 28 }}>{counts[cat.value]}</Badge>
                </Group>
              </Tabs.Tab>
            ))}
          </Tabs.List>

          {CATEGORIES.map((cat) => (
            <Tabs.Panel key={cat.value} value={cat.value}>
              <CategoryTab mounts={cat.mounts} nameFilter={nameFilter} statFilter={statFilter} />
            </Tabs.Panel>
          ))}
        </Tabs>
      </Stack>
    </Container>
  );
}
