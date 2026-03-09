import React, { useState, useEffect } from 'react';
import {
  Container, Title, Text, Stack, Paper, Group, Slider, NumberInput,
  Badge, Divider, ThemeIcon, SegmentedControl, SimpleGrid, Alert, Collapse, UnstyledButton, List,
} from '@mantine/core';
import { Clock, CalendarClock, TriangleAlert, Calculator } from 'lucide-react';

// ─── Tier-based gauge drain calculation ──────────────────────────────────────

const TIERS = [
  { floor: 90000, rate: 40 }, // Tier 4: 90 001 – 100 000
  { floor: 70000, rate: 30 }, // Tier 3: 70 001 – 90 000
  { floor: 40000, rate: 20 }, // Tier 2: 40 001 – 70 000
  { floor: 0,     rate: 10 }, // Tier 1: 0 – 40 000
];

function calcDrainSeconds(startFill: number, toDrain: number): { seconds: number; depleted: boolean } {
  let fill = Math.max(0, Math.min(startFill, 100000));
  let remaining = toDrain;
  let totalSeconds = 0;

  for (const tier of TIERS) {
    if (fill <= tier.floor || remaining <= 0) continue;
    const inTier = fill - tier.floor;
    const canDrain = Math.min(remaining, inTier);
    totalSeconds += (canDrain / tier.rate) * 10;
    remaining -= canDrain;
    fill -= canDrain;
  }

  return { seconds: totalSeconds, depleted: remaining > 0 };
}

function formatDuration(seconds: number): string {
  if (seconds <= 0) return '0 min';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

function formatDatetime(seconds: number, now: number): string {
  const date = new Date(now + seconds * 1000);
  return date.toLocaleString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long',
    hour: '2-digit', minute: '2-digit',
  });
}

function useNow(intervalMs = 30000): number {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

// ─── Stat config ─────────────────────────────────────────────────────────────

const STATS = [
  { key: 'endurance', label: 'Endurance', color: 'yellow', gauge: 'Foudroyeur', serenite: 'négative (< 0)' },
  { key: 'maturite',  label: 'Maturité',  color: 'blue',   gauge: 'Abreuvoir',  serenite: 'neutre (−2 000 à +2 000)' },
  { key: 'amour',     label: 'Amour',     color: 'red',    gauge: 'Dragofesse', serenite: 'positive (> 0)' },
] as const;

type StatKey = typeof STATS[number]['key'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StatSlider({
  label, color, value, onChange, min = 0, max = 20000, step = 100, extra,
}: {
  label: string; color: string; value: number;
  onChange: (v: number) => void; min?: number; max?: number; step?: number;
  extra?: React.ReactNode;
}) {
  return (
    <Stack gap={4}>
      <Group justify="space-between">
        <Group gap="xs">
          <Text size="sm" fw={600} c="dark">{label}</Text>
          {extra}
        </Group>
        <NumberInput
          value={value}
          onChange={(v) => onChange(Math.max(min, Math.min(max, typeof v === 'number' ? v : min)))}
          min={min} max={max} step={step}
          size="xs" w={100}
          allowNegative={min < 0}
        />
      </Group>
      <Slider
        value={value}
        onChange={onChange}
        min={min} max={max} step={step}
        color={color}
        label={(v) => v.toLocaleString('fr-FR')}
      />
      <Group justify="space-between">
        <Text size="xs" c="dimmed">{min.toLocaleString('fr-FR')}</Text>
        <Text size="xs" c="dimmed">{max.toLocaleString('fr-FR')}</Text>
      </Group>
    </Stack>
  );
}

// ─── Simple Calculator ────────────────────────────────────────────────────────

type CalcMode = StatKey | 'serenite';

function SimpleCalc() {
  const now = useNow();
  const [mode, setMode] = useState<CalcMode>('endurance');
  const [current, setCurrent] = useState(0);
  const [gaugeFill, setGaugeFill] = useState(100000);
  // Sérénité-specific
  const [sereniteTarget, setSereniteTarget] = useState(-1000);

  const isSer = mode === 'serenite';
  const statConf = isSer ? null : STATS.find((s) => s.key === mode)!;

  // Sérénité: gauge = Baffeurs (lower) or Caresseurs (raise)
  const serDirection = sereniteTarget < current ? 'baisser' : 'monter';
  const serGauge = sereniteTarget < current ? 'Baffeurs (Sérénité −)' : 'Caresseurs (Sérénité +)';
  const needed = isSer
    ? Math.abs(sereniteTarget - current)
    : Math.max(0, 20000 - current);

  const { seconds, depleted } = calcDrainSeconds(gaugeFill, needed);
  const ready = isSer ? current === sereniteTarget : current >= 20000;

  return (
    <Paper withBorder p="lg" radius="md">
      <Group gap="sm" mb="md">
        <ThemeIcon color="orange" variant="light" size="md" radius="md">
          <Clock size={14} />
        </ThemeIcon>
        <Text fw={700} size="md" c="dark">Calculateur simple</Text>
      </Group>
      <Divider mb="md" color="gray.2" />

      <Stack gap="lg">
        <Stack gap="xs">
          <Text size="sm" fw={600} c="dark">Statistique à monter</Text>
          <SegmentedControl
            value={mode}
            onChange={(v) => { setMode(v as CalcMode); setCurrent(v === 'serenite' ? 0 : 0); }}
            data={[
              ...STATS.map((s) => ({ value: s.key, label: s.label })),
              { value: 'serenite', label: 'Sérénité' },
            ]}
            fullWidth
          />
        </Stack>

        {!isSer && statConf && (
          <StatSlider
            label={`${statConf.label} actuelle`}
            color={statConf.color}
            value={current}
            onChange={setCurrent}
            max={20000}
          />
        )}

        {isSer && (
          <>
            <StatSlider
              label="Sérénité actuelle"
              color="grape"
              value={current}
              onChange={setCurrent}
              min={-5000}
              max={5000}
              step={100}
            />
            <StatSlider
              label="Sérénité cible"
              color="violet"
              value={sereniteTarget}
              onChange={setSereniteTarget}
              min={-5000}
              max={5000}
              step={100}
            />
            <Paper withBorder p="sm" radius="md" bg="gray.0">
              <Stack gap={4}>
                <Text size="xs" fw={600} c="dark">Plages de sérénité pour chaque stat</Text>
                <Group gap="xs" wrap="wrap">
                  <Badge color="yellow" variant="light" size="sm">Endurance : &lt; 0</Badge>
                  <Badge color="blue" variant="light" size="sm">Maturité : −2 000 à +2 000</Badge>
                  <Badge color="red" variant="light" size="sm">Amour : &gt; 0</Badge>
                </Group>
              </Stack>
            </Paper>
          </>
        )}

        <StatSlider
          label="Niveau de la jauge"
          color="gray"
          value={gaugeFill}
          onChange={setGaugeFill}
          max={100000}
          step={1000}
          extra={
            isSer ? (
              <Badge color={serDirection === 'baisser' ? 'violet' : 'grape'} variant="filled" size="sm">
                {serDirection === 'baisser' ? 'Sérénité −' : 'Sérénité +'}
              </Badge>
            ) : statConf ? (
              <Badge color={statConf.color} variant="filled" size="sm">{statConf.label}</Badge>
            ) : null
          }
        />

        <Divider color="gray.2" />

        {ready ? (
          <Paper withBorder p="md" radius="md" bg="green.0" style={{ borderColor: 'var(--mantine-color-green-4)' }}>
            <Text size="sm" fw={700} c="green.7">
              {isSer ? 'Sérénité déjà dans la plage cible !' : 'Stat déjà au maximum !'}
            </Text>
          </Paper>
        ) : (
          <Stack gap="sm">
            {depleted && (
              <Alert color="red" variant="light" icon={<TriangleAlert size={14} />}>
                La jauge se videra avant d'atteindre la cible.
              </Alert>
            )}
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
              <Paper withBorder p="md" radius="md" bg="gray.0">
                <Stack gap={2}>
                  <Text size="xs" c="dimmed" tt="uppercase" lts={0.5}>Points manquants</Text>
                  <Text fw={700} size="lg" c="dark">{needed.toLocaleString('fr-FR')}</Text>
                </Stack>
              </Paper>
              <Paper withBorder p="md" radius="md" bg="gray.0">
                <Stack gap={2}>
                  <Text size="xs" c="dimmed" tt="uppercase" lts={0.5}>Temps estimé</Text>
                  <Text fw={700} size="lg" c="dark">{formatDuration(seconds)}</Text>
                </Stack>
              </Paper>
            </SimpleGrid>
            <Paper withBorder p="md" radius="md" bg="orange.0" style={{ borderColor: 'var(--mantine-color-orange-3)' }}>
              <Group gap="sm" wrap="nowrap">
                <CalendarClock size={16} color="var(--mantine-color-orange-6)" style={{ flexShrink: 0 }} />
                <Stack gap={0}>
                  <Text size="xs" c="dimmed">{isSer ? 'Sérénité atteinte le' : 'Sortir la monture le'}</Text>
                  <Text fw={700} size="sm" c="orange.7">{formatDatetime(seconds, now)}</Text>
                </Stack>
              </Group>
            </Paper>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}

// ─── Full Planner ─────────────────────────────────────────────────────────────

interface SerenitePhase {
  type: 'serenite';
  from: number;
  to: number;
  gauge: string;
  needed: number;
  seconds: number;
  depleted: boolean;
}

interface StatPhaseItem {
  key: StatKey;
  label: string;
  color: string;
  needed: number;
  seconds: number;
  depleted: boolean;
}

interface StatPhase {
  type: 'stat';
  stats: StatPhaseItem[];
  seconds: number;
  note?: string;
}

type PhasePlan = SerenitePhase | StatPhase;

function buildPlan(
  startSer: number,
  endurance: number,
  maturite: number,
  amour: number,
  gaugeFill: number,
): PhasePlan[] {
  const plans: PhasePlan[] = [];
  let endNeeded = Math.max(0, 20000 - endurance);
  let matNeeded = Math.max(0, 20000 - maturite);
  let amourNeeded = Math.max(0, 20000 - amour);
  let currentSer = startSer;

  function addStatPhase(items: StatPhaseItem[], note?: string) {
    const maxSec = Math.max(...items.map((s) => s.seconds), 0);
    plans.push({ type: 'stat', stats: items, seconds: maxSec, note });
  }

  function addSerPhase(target: number) {
    if (target === currentSer) return;
    const needed = Math.abs(target - currentSer);
    const { seconds, depleted } = calcDrainSeconds(gaugeFill, needed);
    const gauge = target < currentSer ? 'Baffeurs (Sérénité −)' : 'Caresseurs (Sérénité +)';
    plans.push({ type: 'serenite', from: currentSer, to: target, gauge, needed, seconds, depleted });
    currentSer = target;
  }

  const doEndFirst = currentSer < 0;

  if (doEndFirst) {
    // If too deep in negatives to reach Mat overlap, raise to -2000 first
    if (endNeeded > 0 && matNeeded > 0 && currentSer < -2000) {
      addSerPhase(-2000);
    }

    if (endNeeded > 0) {
      const inOverlap = currentSer >= -2000 && currentSer < 0;
      const endResult = calcDrainSeconds(gaugeFill, endNeeded);
      if (inOverlap && matNeeded > 0) {
        const matGained = Math.min(matNeeded, endNeeded);
        const matResult = calcDrainSeconds(gaugeFill, matGained);
        addStatPhase([
          { key: 'endurance', label: 'Endurance', color: 'yellow', needed: endNeeded, ...endResult },
          { key: 'maturite',  label: 'Maturité',  color: 'blue',   needed: matGained,  ...matResult },
        ], 'Sérénité négative — Endurance + Maturité simultanées');
        matNeeded -= matGained;
      } else {
        addStatPhase([
          { key: 'endurance', label: 'Endurance', color: 'yellow', needed: endNeeded, ...endResult },
        ]);
      }
      endNeeded = 0;
    }

    if (amourNeeded > 0) {
      const targetSer = matNeeded > 0 ? 2000 : 0;
      addSerPhase(targetSer);
      const amourResult = calcDrainSeconds(gaugeFill, amourNeeded);
      const inOverlap = currentSer >= 0 && currentSer <= 2000;
      if (inOverlap && matNeeded > 0) {
        const matGained = Math.min(matNeeded, amourNeeded);
        const matResult = calcDrainSeconds(gaugeFill, matGained);
        addStatPhase([
          { key: 'amour',    label: 'Amour',    color: 'red',  needed: amourNeeded, ...amourResult },
          { key: 'maturite', label: 'Maturité', color: 'blue', needed: matGained,   ...matResult },
        ], 'Sérénité positive — Amour + Maturité simultanés');
        matNeeded -= matGained;
      } else {
        addStatPhase([
          { key: 'amour', label: 'Amour', color: 'red', needed: amourNeeded, ...amourResult },
        ]);
      }
      amourNeeded = 0;
    }
  } else {
    // doAmourFirst (startSer > 0)
    // If too high above overlap, lower to +2000 first
    if (amourNeeded > 0 && matNeeded > 0 && currentSer > 2000) {
      addSerPhase(2000);
    }

    if (amourNeeded > 0) {
      const inOverlap = currentSer >= 0 && currentSer <= 2000;
      const amourResult = calcDrainSeconds(gaugeFill, amourNeeded);
      if (inOverlap && matNeeded > 0) {
        const matGained = Math.min(matNeeded, amourNeeded);
        const matResult = calcDrainSeconds(gaugeFill, matGained);
        addStatPhase([
          { key: 'amour',    label: 'Amour',    color: 'red',  needed: amourNeeded, ...amourResult },
          { key: 'maturite', label: 'Maturité', color: 'blue', needed: matGained,   ...matResult },
        ], 'Sérénité positive — Amour + Maturité simultanés');
        matNeeded -= matGained;
      } else {
        addStatPhase([
          { key: 'amour', label: 'Amour', color: 'red', needed: amourNeeded, ...amourResult },
        ]);
      }
      amourNeeded = 0;
    }

    if (endNeeded > 0) {
      const targetSer = matNeeded > 0 ? -2000 : -1;
      addSerPhase(targetSer);
      const endResult = calcDrainSeconds(gaugeFill, endNeeded);
      const inOverlap = currentSer >= -2000 && currentSer < 0;
      if (inOverlap && matNeeded > 0) {
        const matGained = Math.min(matNeeded, endNeeded);
        const matResult = calcDrainSeconds(gaugeFill, matGained);
        addStatPhase([
          { key: 'endurance', label: 'Endurance', color: 'yellow', needed: endNeeded, ...endResult },
          { key: 'maturite',  label: 'Maturité',  color: 'blue',   needed: matGained,  ...matResult },
        ], 'Sérénité négative — Endurance + Maturité simultanées');
        matNeeded -= matGained;
      } else {
        addStatPhase([
          { key: 'endurance', label: 'Endurance', color: 'yellow', needed: endNeeded, ...endResult },
        ]);
      }
      endNeeded = 0;
    }
  }

  // Remaining Maturité not covered by overlap phases
  if (matNeeded > 0) {
    if (currentSer < -2000 || currentSer > 2000) {
      addSerPhase(0);
    }
    const matResult = calcDrainSeconds(gaugeFill, matNeeded);
    addStatPhase([
      { key: 'maturite', label: 'Maturité', color: 'blue', needed: matNeeded, ...matResult },
    ], 'Sérénité neutre — Maturité seule');
  }

  // suppress unused var warnings
  void endNeeded; void amourNeeded;

  return plans;
}

function PhaseCard({ phase, step }: { phase: PhasePlan; step: number }) {
  if (phase.type === 'serenite') {
    return (
      <Paper withBorder p="sm" radius="md" bg="grape.0" style={{ borderColor: 'var(--mantine-color-grape-3)' }}>
        <Group gap="sm" wrap="nowrap">
          <Badge color="grape" variant="filled" size="sm" circle>{step}</Badge>
          <Stack gap={2} style={{ flex: 1 }}>
            <Group justify="space-between" wrap="nowrap">
              <Text size="sm" fw={600} c="grape.7">
                Ajuster la Sérénité : {phase.from.toLocaleString('fr-FR')} → {phase.to.toLocaleString('fr-FR')}
              </Text>
              <Text size="sm" fw={700} c="dark">{formatDuration(phase.seconds)}</Text>
            </Group>
            <Group gap="xs">
              <Text size="xs" c="dimmed">
                Jauge : <Text component="span" fw={600}>{phase.gauge}</Text> — {phase.needed.toLocaleString('fr-FR')} pts
              </Text>
              {phase.depleted && <Badge color="orange" variant="light" size="xs">Rechargement requis</Badge>}
            </Group>
          </Stack>
        </Group>
      </Paper>
    );
  }

  const isSimultaneous = phase.stats.length > 1;
  return (
    <Paper withBorder p="sm" radius="md">
      <Stack gap="xs">
        <Group justify="space-between" wrap="nowrap">
          <Group gap="xs" wrap="nowrap">
            <Badge color="teal" variant="filled" size="sm" circle>{step}</Badge>
            <Text size="sm" fw={600} c="dark">
              {phase.stats.map((s) => s.label).join(' + ')}
            </Text>
            {isSimultaneous && <Badge color="teal" variant="light" size="xs">Simultané</Badge>}
          </Group>
          <Text size="sm" fw={700} c="dark">{formatDuration(phase.seconds)}</Text>
        </Group>
        {phase.note && <Text size="xs" c="dimmed">{phase.note}</Text>}
        {phase.stats.map((stat) => (
          <Group key={stat.key} gap="xs">
            <Badge color={stat.color} variant="light" size="xs">{stat.label}</Badge>
            <Text size="xs" c="dimmed">
              {stat.needed.toLocaleString('fr-FR')} pts — {formatDuration(stat.seconds)}
            </Text>
            {stat.depleted && <Badge color="orange" variant="light" size="xs">Rechargement requis</Badge>}
          </Group>
        ))}
      </Stack>
    </Paper>
  );
}

function FullPlanner() {
  const [endurance, setEndurance] = useState(0);
  const [maturite, setMaturite] = useState(0);
  const [amour, setAmour] = useState(0);
  const [startSer, setStartSer] = useState(0);
  const [gaugeFill, setGaugeFill] = useState(100000);

  const now = useNow();
  const plan = buildPlan(startSer, endurance, maturite, amour, gaugeFill);
  const totalSeconds = plan.reduce((sum, p) => sum + p.seconds, 0);
  const allDone = plan.length === 0;

  return (
    <Paper withBorder p="lg" radius="md">
      <Group gap="sm" mb="md">
        <ThemeIcon color="teal" variant="light" size="md" radius="md">
          <CalendarClock size={14} />
        </ThemeIcon>
        <Text fw={700} size="md" c="dark">Planification complète</Text>
      </Group>
      <Divider mb="md" color="gray.2" />

      <Stack gap="lg">
        <Text size="sm" c="dimmed">
          Planifie automatiquement les phases selon la Sérénité de départ, en exploitant les zones de recouvrement (−2 000 à −1 et 0 à +2 000) pour gagner Maturité + Endurance ou Amour en simultané.
        </Text>

        <StatSlider label="Endurance actuelle" color="yellow" value={endurance} onChange={setEndurance} />
        <StatSlider label="Maturité actuelle" color="blue" value={maturite} onChange={setMaturite} />
        <StatSlider label="Amour actuel" color="red" value={amour} onChange={setAmour} />
        <StatSlider
          label="Sérénité de départ"
          color="grape"
          value={startSer}
          onChange={setStartSer}
          min={-5000}
          max={5000}
          step={100}
        />
        <StatSlider
          label="Niveau de jauge au début de chaque phase"
          color="gray"
          value={gaugeFill}
          onChange={setGaugeFill}
          max={100000}
          step={1000}
        />

        <Divider color="gray.2" />

        {allDone ? (
          <Paper withBorder p="md" radius="md" bg="green.0" style={{ borderColor: 'var(--mantine-color-green-4)' }}>
            <Text fw={700} size="sm" c="green.7">Toutes les stats sont au maximum — la monture est prête !</Text>
          </Paper>
        ) : (
          <Stack gap="sm">
            {plan.map((phase, i) => (
              <PhaseCard key={i} phase={phase} step={i + 1} />
            ))}

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm" mt="xs">
              <Paper withBorder p="md" radius="md" bg="gray.0">
                <Stack gap={2}>
                  <Text size="xs" c="dimmed" tt="uppercase" lts={0.5}>Durée totale</Text>
                  <Text fw={700} size="xl" c="dark">{formatDuration(totalSeconds)}</Text>
                </Stack>
              </Paper>
              <Paper withBorder p="md" radius="md" bg="orange.0" style={{ borderColor: 'var(--mantine-color-orange-3)' }}>
                <Stack gap={2}>
                  <Text size="xs" c="dimmed" tt="uppercase" lts={0.5}>Sortir la monture le</Text>
                  <Text fw={700} size="sm" c="orange.7">{formatDatetime(totalSeconds, now)}</Text>
                </Stack>
              </Paper>
            </SimpleGrid>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Calculateur() {
  const [helpOpen, setHelpOpen] = useState(true);

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <Stack gap={4}>
          <Group gap="sm">
            <Calculator size={28} />
            <Title order={1} c="dark">Calculateur d'élevage</Title>
          </Group>
          <Text c="dimmed">
            Estimez le temps nécessaire pour remplir les statistiques de vos montures en fonction du niveau de vos jauges d'enclos.
          </Text>
        </Stack>

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
                <Text size="sm">Chaque unité drainée de la jauge transfère <Text component="span" fw={600}>1 point de statistique</Text> à la monture. La vitesse dépend du niveau de remplissage (Tiers 1 à 4).</Text>
              </List.Item>
              <List.Item>
                <Text size="sm">Utilisez le <Text component="span" fw={600}>Calculateur simple</Text> pour estimer le temps jusqu'à un objectif précis : montée d'une stat ou ajustement de la Sérénité.</Text>
              </List.Item>
              <List.Item>
                <Text size="sm">Utilisez la <Text component="span" fw={600}>Planification complète</Text> pour générer automatiquement l'ordre optimal des phases (Endurance, Maturité, Amour) en exploitant les zones de recouvrement pour gagner deux stats simultanément.</Text>
              </List.Item>
              <List.Item>
                <Text size="sm">Les <Text component="span" fw={600}>zones de recouvrement</Text> sont : Sérénité −2 000 à −1 (Endurance + Maturité simultanées) et 0 à +2 000 (Amour + Maturité simultanées).</Text>
              </List.Item>
              <List.Item>
                <Text size="sm">Si la jauge se vide avant d'atteindre la cible, un avertissement <Text component="span" fw={600} c="orange.7">Rechargement requis</Text> s'affiche — rechargez la jauge et relancez le calcul.</Text>
              </List.Item>
            </List>
          </Collapse>
        </Paper>

        <SimpleCalc />
        <FullPlanner />
      </Stack>
    </Container>
  );
}
