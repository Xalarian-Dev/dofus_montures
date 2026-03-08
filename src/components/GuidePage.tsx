import { Container, Stack, Title, Text, Paper, Divider, Badge, Group, ThemeIcon, Code, Image, Tooltip, CopyButton, Table, Anchor } from '@mantine/core';
import { BookOpen, Egg, Heart, Info, MapPin, Sliders, TrendingUp, Copy, Star } from 'lucide-react';
import { dragodindes } from '@/data/mounts/dragodindes';
import { muldos } from '@/data/mounts/muldos';
import { volkornes } from '@/data/mounts/volkornes';

function TravelCoord({ x, y }: { x: number; y: number }) {
  const command = `/travel ${x} ${y}`;
  return (
    <CopyButton value={command} timeout={1500}>
      {({ copied, copy }) => (
        <Tooltip label={copied ? 'Copié !' : command} withArrow>
          <Code
            style={{ cursor: 'pointer', userSelect: 'none' }}
            onClick={copy}
          >
            [{x}, {y}]
          </Code>
        </Tooltip>
      )}
    </CopyButton>
  );
}

const GEN1 = {
  dragodindes: dragodindes.filter((m) => m.generation === 1),
  muldos: muldos.filter((m) => m.generation === 1),
  volkornes: volkornes.filter((m) => m.generation === 1),
};

const TOC_SECTIONS = [
  { id: 'zones', label: 'Zones de capture' },
  { id: 'capture', label: 'Capture' },
  { id: 'jauges', label: "Jauges d'Enclos" },
  { id: 'fertilite', label: 'Fertilité' },
  { id: 'experience', label: 'Expérience' },
  { id: 'reproduction', label: 'Reproduction' },
  { id: 'probabilites', label: 'Probabilités de génération' },
  { id: 'clonage', label: 'Clonage' },
];

interface RuleBlockProps {
  id?: string;
  title: string;
  color: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function RuleBlock({ id, title, color, icon, children }: RuleBlockProps) {
  return (
    <Paper id={id} withBorder p="md" radius="md" style={{ scrollMarginTop: 72 }}>
      <Group gap="sm" mb="sm">
        <ThemeIcon color={color} variant="light" size="md" radius="md">
          {icon}
        </ThemeIcon>
        <Text fw={700} size="md" c="dark">{title}</Text>
      </Group>
      <Divider mb="sm" color="gray.2" />
      {children}
    </Paper>
  );
}

export function GuidePage() {
  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <Stack gap={4}>
          <Group gap="sm">
            <BookOpen size={28} />
            <Title order={1} c="dark">Guide d'élevage</Title>
          </Group>
          <Text c="dimmed">Règles et mécaniques de reproduction des montures dans Dofus.</Text>
        </Stack>

        {/* Sommaire */}
        <Paper withBorder p="md" radius="md" bg="gray.0">
          <Text fw={700} size="sm" c="dark" mb="sm">Sommaire</Text>
          <Group gap="xs" wrap="wrap">
            {TOC_SECTIONS.map((s, i) => (
              <Anchor key={s.id} href={`#${s.id}`} underline="never">
                <Badge variant="outline" color="orange" size="md" style={{ cursor: 'pointer' }}>
                  {i + 1}. {s.label}
                </Badge>
              </Anchor>
            ))}
          </Group>
        </Paper>

        {/* Où trouver les montures */}
        <RuleBlock id="zones" title="Où trouver les montures de génération 1" color="blue" icon={<MapPin size={14} />}>
          <Stack gap="xs">
            <Text size="sm" c="dark">Seules les montures de <Text component="span" fw={600}>génération 1</Text> peuvent être capturées dans le monde du jeu. Les générations supérieures s'obtiennent uniquement par élevage.</Text>
            <Stack gap={6} mt={4}>
              {/* Dragodindes */}
              <Paper withBorder p="sm" radius="md" bg="teal.0" style={{ borderColor: 'var(--mantine-color-teal-3)' }}>
                <Group gap="sm" mb="xs">
                  <Badge color="teal" variant="light" style={{ flexShrink: 0 }}>Dragodindes</Badge>
                  <Text size="sm" c="dark">Zone <Text component="span" fw={600}>Territoires des Dragodindes</Text> — Zaap Village des Éleveurs <TravelCoord x={-16} y={1} /></Text>
                </Group>
                <Group gap="md" wrap="wrap">
                  {GEN1.dragodindes.map((m) => (
                    <Stack key={m.id} gap={2} align="center" style={{ width: 56 }}>
                      {m.sprite && <Image src={m.sprite} w={40} h={40} fit="contain" style={{ imageRendering: 'pixelated' }} />}
                      <Text size="xs" ta="center" c="dark" lh={1.2}>{m.name.replace('Dragodinde ', '')}</Text>
                    </Stack>
                  ))}
                </Group>
              </Paper>

              {/* Muldos */}
              <Paper withBorder p="sm" radius="md" bg="blue.0" style={{ borderColor: 'var(--mantine-color-blue-3)' }}>
                <Group gap="sm" mb="xs">
                  <Badge color="blue" variant="light" style={{ flexShrink: 0 }}>Muldos</Badge>
                  <Text size="sm" c="dark">Zone <Text component="span" fw={600}>Bassin des Muldos</Text> — Zaap Sufokia <TravelCoord x={22} y={19} /></Text>
                </Group>
                <Group gap="md" wrap="wrap">
                  {GEN1.muldos.map((m) => (
                    <Stack key={m.id} gap={2} align="center" style={{ width: 56 }}>
                      {m.sprite && <Image src={m.sprite} w={40} h={40} fit="contain" style={{ imageRendering: 'pixelated' }} />}
                      <Text size="xs" ta="center" c="dark" lh={1.2}>{m.name.replace('Muldo ', '')}</Text>
                    </Stack>
                  ))}
                </Group>
              </Paper>

              {/* Volkornes */}
              <Paper withBorder p="sm" radius="md" bg="red.0" style={{ borderColor: 'var(--mantine-color-red-3)' }}>
                <Group gap="sm" mb="xs">
                  <Badge color="red" variant="light" style={{ flexShrink: 0 }}>Volkornes</Badge>
                  <Text size="sm" c="dark">Zone <Text component="span" fw={600}>Haras de Brâkmar</Text> — Zaap Brâkmar <TravelCoord x={-25} y={40} /></Text>
                </Group>
                <Group gap="md" wrap="wrap">
                  {GEN1.volkornes.map((m) => (
                    <Stack key={m.id} gap={2} align="center" style={{ width: 56 }}>
                      {m.sprite && <Image src={m.sprite} w={40} h={40} fit="contain" style={{ imageRendering: 'pixelated' }} />}
                      <Text size="xs" ta="center" c="dark" lh={1.2}>{m.name.replace('Volkorne ', '')}</Text>
                    </Stack>
                  ))}
                </Group>
              </Paper>
            </Stack>
          </Stack>
        </RuleBlock>

        {/* Généralités */}
        <RuleBlock id="capture" title="Capture" color="gray" icon={<Info size={14} />}>
          <Stack gap="sm">
            <Text size="sm" c="dark">Pour capturer une monture, équipez un <Text component="span" fw={600}>filet de capture</Text>. Cela fait apparaître le sort <Text component="span" fw={600}>Apprivoisement de monture</Text> dans votre barre de sorts <Text component="span" c="dimmed">(1 PA — portée 1 à 7 PO)</Text>.</Text>
            <Stack gap={6}>
              {([
                { name: 'Filet de capture universel', level: 'Niveau 1 ou +', zone: '1 Cible', result: '1 Exemplaire de la cible' },
                { name: 'Filet multiplicateur de Dragodinde', level: 'Niveau 100 ou +', zone: '1 Cible', result: 'Plusieurs exemplaires de la cible' },
                { name: 'Filet à Dragodinde renforcé', level: 'Niveau 150 ou +', zone: 'Cible en zone', result: '1 Exemplaire de chaque cible' },
                { name: 'Filet multiplicateur de Dragodinde renforcé', level: 'Niveau 200', zone: 'Cible en zone', result: 'Plusieurs exemplaires de chaque cible' },
              ] as const).map((net) => (
                <Paper key={net.name} withBorder p="sm" radius="md" bg="gray.0">
                  <Group justify="space-between" wrap="wrap" gap="xs">
                    <Stack gap={2}>
                      <Text size="sm" fw={600} c="dark">{net.name}</Text>
                      <Badge size="xs" variant="outline" color="gray">{net.level}</Badge>
                    </Stack>
                    <Group gap="xs">
                      <Badge size="sm" color="blue" variant="light">{net.zone}</Badge>
                      <Badge size="sm" color="green" variant="light">{net.result}</Badge>
                    </Group>
                  </Group>
                </Paper>
              ))}
            </Stack>
          </Stack>
        </RuleBlock>

        {/* Jauges d'Enclos */}
        <RuleBlock id="jauges" title="Jauges d'Enclos" color="violet" icon={<Sliders size={14} />}>
          <Stack gap="md">
            <Text size="sm" c="dark">Le système repose sur <Text component="span" fw={600}>6 jauges interactives</Text> qui agissent directement sur les statistiques de vos montures. Vous pouvez activer jusqu'à <Text component="span" fw={600}>2 jauges simultanément</Text> par enclos, modifiables à distance depuis n'importe où en jeu.</Text>

            <Stack gap={6}>
              {([
                { color: 'violet', label: 'Sérénité −', tool: 'Baffeurs', desc: 'Baisse la sérénité' },
                { color: 'grape', label: 'Sérénité +', tool: 'Caresseurs', desc: 'Augmente la sérénité' },
                { color: 'yellow', label: 'Endurance', tool: 'Foudroyeur', desc: 'Augmente l\'endurance' },
                { color: 'blue', label: 'Maturité', tool: 'Abreuvoir', desc: 'Augmente la maturité' },
                { color: 'red', label: 'Amour', tool: 'Dragofesse', desc: 'Augmente l\'amour' },
                { color: 'green', label: 'Expérience', tool: 'Mangeoire', desc: 'Augmente l\'expérience' },
              ] as const).map((gauge) => (
                <Paper key={gauge.label} withBorder p="xs" radius="md">
                  <Group gap="sm">
                    <Badge color={gauge.color} variant="filled" size="sm" style={{ flexShrink: 0 }}>{gauge.label}</Badge>
                    <Text size="sm" c="dark"><Text component="span" fw={600}>{gauge.tool}</Text> — {gauge.desc}</Text>
                  </Group>
                </Paper>
              ))}
            </Stack>

            <Stack gap={4}>
              <Text size="sm" fw={600} c="dark">Consommation par palier</Text>
              <Text size="xs" c="dimmed">Une jauge pleine contient 100 000 unités. La vitesse de transfert dépend du niveau de remplissage. Une jauge pleine met <Text component="span" fw={600}>17h48</Text> pour se vider totalement.</Text>
              <Table withTableBorder withColumnBorders fz="sm" mt={4}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Palier</Table.Th>
                    <Table.Th>Volume de la jauge</Table.Th>
                    <Table.Th>Consommation (/ 10s)</Table.Th>
                    <Table.Th>Temps pour vider</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {([
                    { tier: 'Tier 1', range: '0 à 40 000', rate: '10 unités', time: '~11h 06min' },
                    { tier: 'Tier 2', range: '40 001 à 70 000', rate: '20 unités', time: '~04h 09min' },
                    { tier: 'Tier 3', range: '70 001 à 90 000', rate: '30 unités', time: '~01h 51min' },
                    { tier: 'Tier 4', range: '90 001 à 100 000', rate: '40 unités', time: '~42min' },
                  ] as const).map((row) => (
                    <Table.Tr key={row.tier}>
                      <Table.Td fw={600}>{row.tier}</Table.Td>
                      <Table.Td>{row.range}</Table.Td>
                      <Table.Td>{row.rate}</Table.Td>
                      <Table.Td>{row.time}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Stack>

            <Paper withBorder p="sm" radius="md" bg="yellow.0" style={{ borderColor: 'var(--mantine-color-yellow-4)' }}>
              <Text size="sm" c="dark">
                <Text component="span" fw={600}>Optimisation :</Text> La consommation de carburant est fixe, peu importe le nombre de bêtes dans l'enclos. Ayez toujours <Text component="span" fw={600}>10 montures</Text> dans l'enclos pour rentabiliser chaque unité consommée.
              </Text>
            </Paper>
          </Stack>
        </RuleBlock>

        {/* Fertilité */}
        <RuleBlock id="fertilite" title="Fertilité" color="pink" icon={<Heart size={14} />}>
          <Stack gap="md">
            <Text size="sm" c="dark">Pour qu'une monture soit prête pour la reproduction, elle doit atteindre le maximum dans ses <Text component="span" fw={600}>trois statistiques principales</Text> : <Text component="span" fw={600}>Endurance</Text>, <Text component="span" fw={600}>Maturité</Text> et <Text component="span" fw={600}>Amour</Text>. La limite est de <Text component="span" fw={600}>20 000 points</Text> pour chacune. Chaque statistique arrivée à son maximum change de couleur dans l'interface.</Text>

            <Stack gap={4}>
              <Text size="sm" fw={600} c="dark">Gestion de la Sérénité</Text>
              <Text size="sm" c="dark">La <Text component="span" fw={600}>Sérénité</Text> est le point clé : elle détermine quelle statistique peut progresser. Une monture ne peut pas monter n'importe quelle jauge à n'importe quel moment.</Text>
              <Stack gap={6} mt={4}>
                {([
                  { color: 'yellow', label: 'Endurance', range: '-5 000 à -1', desc: 'Sérénité négative' },
                  { color: 'blue', label: 'Maturité', range: '-2 000 à +2 000', desc: 'Sérénité neutre' },
                  { color: 'red', label: 'Amour', range: '0 à +5 000', desc: 'Sérénité positive' },
                ] as const).map((stat) => (
                  <Paper key={stat.label} withBorder p="xs" radius="md">
                    <Group gap="sm">
                      <Badge color={stat.color} variant="filled" size="sm" style={{ flexShrink: 0 }}>{stat.label}</Badge>
                      <Text size="sm" c="dark">{stat.desc} — <Text component="span" c="dimmed">{stat.range}</Text></Text>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            </Stack>

            <Paper withBorder p="sm" radius="md" bg="yellow.0" style={{ borderColor: 'var(--mantine-color-yellow-4)' }}>
              <Text size="sm" c="dark">
                <Text component="span" fw={600}>Astuce :</Text> Les tranches se chevauchent légèrement. Si la sérénité est entre <Text component="span" fw={600}>-2 000 et -1</Text> ou entre <Text component="span" fw={600}>0 et +2 000</Text>, vous pouvez monter <Text component="span" fw={600}>2 statistiques simultanément</Text>. Surveillez la sérénité avant d'activer vos jauges pour ne pas gaspiller de carburant.
              </Text>
            </Paper>
          </Stack>
        </RuleBlock>

        {/* Expérience */}
        <RuleBlock id="experience" title="Expérience" color="green" icon={<Star size={14} />}>
          <Stack gap="md">
            <Text size="sm" c="dark">L'expérience d'une monture est alimentée par la jauge <Text component="span" fw={600}>Mangeoire</Text> dans l'enclos. Plus une monture monte en niveau, plus elle devient précieuse — à la fois comme monture équipée et comme parent pour l'élevage.</Text>

            <Stack gap={4}>
              <Text size="sm" fw={600} c="dark">Effets du niveau</Text>
              <Stack gap={6}>
                {([
                  {
                    color: 'violet',
                    label: 'Statistiques en combat',
                    desc: 'Chaque niveau augmente les bonus de caractéristiques accordés lorsque la monture est équipée par le joueur (Vitalité, Sagesse, etc.).',
                  },
                  {
                    color: 'teal',
                    label: 'Probabilité de génération',
                    desc: 'Chaque niveau supplémentaire sur le couple de parents augmente la chance d\'obtenir un bébé de génération supérieure de +0,15 % (voir section Probabilités).',
                  },
                ] as const).map((item) => (
                  <Paper key={item.label} withBorder p="xs" radius="md">
                    <Group gap="sm" align="flex-start">
                      <Badge variant="light" color={item.color} size="sm" style={{ flexShrink: 0 }}>{item.label}</Badge>
                      <Text size="sm" c="dark">{item.desc}</Text>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            </Stack>

          </Stack>
        </RuleBlock>

        {/* Reproduction */}
        <RuleBlock id="reproduction" title="Reproduction" color="green" icon={<Egg size={14} />}>
          <Stack gap="md">
            <Text size="sm" c="dark">Pour obtenir une naissance, réunissez un <Text component="span" fw={600}>mâle et une femelle FECONDES de la même espèce</Text>. Le croisement entre espèces différentes est impossible.</Text>

            <Stack gap={4}>
              <Text size="sm" fw={600} c="dark">Procédure</Text>
              <Stack gap={6}>
                {([
                  'Transférez impérativement votre couple dans l\'étable.',
                  'Ouvrez l\'onglet « Accouplement » dans votre interface d\'élevage.',
                  'Placez vos deux montures dans les emplacements prévus.',
                ] as const).map((step, i) => (
                  <Paper key={i} withBorder p="xs" radius="md">
                    <Group gap="sm">
                      <Badge variant="filled" color="green" size="sm" circle style={{ flexShrink: 0 }}>{i + 1}</Badge>
                      <Text size="sm" c="dark">{step}</Text>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            </Stack>

            <Stack gap={4}>
              <Text size="sm" fw={600} c="dark">Avant de valider</Text>
              <Stack gap={6}>
                {([
                  { label: 'Probabilités', desc: 'Les chances d\'obtenir tel ou tel type de monture.' },
                  { label: 'Gain', desc: 'L\'expérience de métier et les génétons que l\'action vous rapportera.' },
                  { label: 'Makina', desc: 'Insérez un consommable (Makina) entre les parents pour influencer les capacités ou les probabilités du bébé.' },
                ] as const).map((item) => (
                  <Paper key={item.label} withBorder p="xs" radius="md">
                    <Group gap="sm" align="flex-start">
                      <Badge variant="light" color="green" size="sm" style={{ flexShrink: 0 }}>{item.label}</Badge>
                      <Text size="sm" c="dark">{item.desc}</Text>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            </Stack>

            <Stack gap={6}>
              <Text size="sm" c="dark">La naissance est <Text component="span" fw={600}>instantanée</Text> une fois l'accouplement validé (le système de gestation a été supprimé).</Text>
              <Paper withBorder p="sm" radius="md" bg="red.0" style={{ borderColor: 'var(--mantine-color-red-4)' }}>
                <Stack gap={4}>
                  <Text size="sm" fw={700} c="red">Règles importantes</Text>
                  <Text size="sm" c="dark"><Text component="span" fw={600}>Stérilité :</Text> Après l'accouplement, les deux parents deviennent <Text component="span" fw={600}>définitivement stériles</Text>.</Text>
                  <Text size="sm" c="dark"><Text component="span" fw={600}>Portée :</Text> 1 seul petit par naissance — sauf si l'un des parents possède la capacité <Text component="span" fw={600}>Reproducteur</Text>, ce qui monte le total à 2.</Text>
                </Stack>
              </Paper>
              <Stack gap={4}>
                <Text size="sm" fw={600} c="dark">Caractéristiques du nouveau-né</Text>
                <Stack gap={6}>
                  {([
                    'Commence toujours au niveau 1.',
                    'Jauges (Amour, Maturité, Endurance) à zéro.',
                    'Sexe déterminé aléatoirement.',
                  ] as const).map((fact, i) => (
                    <Paper key={i} withBorder p="xs" radius="md" bg="gray.0">
                      <Text size="sm" c="dark">{fact}</Text>
                    </Paper>
                  ))}
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </RuleBlock>

        {/* Probabilités de génération */}
        <RuleBlock id="probabilites" title="Probabilités de génération" color="teal" icon={<TrendingUp size={14} />}>
          <Stack gap="md">
            <Text size="sm" c="dark">Lors d'un accouplement, le bébé a une chance d'être de la <Text component="span" fw={600}>génération suivante</Text>. Le taux de base est de <Text component="span" fw={600}>30 %</Text>.</Text>

            <Stack gap={4}>
              <Text size="sm" fw={600} c="dark">Influence du niveau des parents</Text>
              <Text size="sm" c="dark">Chaque niveau supplémentaire sur le couple augmente la probabilité de <Text component="span" fw={600}>0,15 %</Text>. Le calcul se base sur le cumul des niveaux du père et de la mère :</Text>
              <Paper withBorder p="sm" radius="md" bg="gray.0" style={{ fontFamily: 'monospace' }}>
                <Text size="sm" c="dark" ta="center">Bonus = (Niveau Père + Niveau Mère) × 0,15 %</Text>
              </Paper>
              <Paper withBorder p="sm" radius="md" bg="teal.0" style={{ borderColor: 'var(--mantine-color-teal-3)' }}>
                <Stack gap={4}>
                  <Text size="sm" c="dark" ta="center"><Text component="span" fw={600}>Niveau 100 × 2 :</Text> (100 + 100) × 0,15 % = <Text component="span" fw={600}>+30 %</Text> → <Text component="span" fw={600}>60 %</Text> de chance</Text>
                  <Text size="sm" c="dark" ta="center"><Text component="span" fw={600}>Niveau 200 × 2 :</Text> (200 + 200) × 0,15 % = <Text component="span" fw={600}>+60 %</Text> → <Text component="span" fw={600}>90 %</Text> de chance</Text>
                </Stack>
              </Paper>
            </Stack>

            <Paper withBorder p="sm" radius="md" bg="yellow.0" style={{ borderColor: 'var(--mantine-color-yellow-4)' }}>
              <Text size="sm" c="dark">
                <Text component="span" fw={600}>Optimakina :</Text> Ce consommable (fabriqué par les Éleveurs) ajoute <Text component="span" fw={600}>+10 %</Text>. Avec deux parents niveau 200, cela donne <Text component="span" fw={600}>100 % de réussite</Text> — la seule méthode pour éliminer totalement l'aléa.
              </Text>
            </Paper>
          </Stack>
        </RuleBlock>

        {/* Clonage */}
        <RuleBlock id="clonage" title="Clonage" color="cyan" icon={<Copy size={14} />}>
          <Stack gap="md">
            <Text size="sm" c="dark">Une fois stériles, vos montures peuvent être <Text component="span" fw={600}>clonées</Text> via le bouton « Clonage » dans l'interface d'élevage. Cela vous permet de récupérer une nouvelle monture fertile depuis deux montures usagées.</Text>

            <Stack gap={6}>
              {([
                { label: 'Condition', desc: 'Fusionner deux montures stériles de la même espèce et de la même génération.' },
                { label: 'Coût', desc: 'Les deux montures d\'origine sont définitivement supprimées.' },
                { label: 'Gain', desc: 'Une copie conforme de l\'une des deux montures sacrifiées.' },
              ] as const).map((item) => (
                <Paper key={item.label} withBorder p="xs" radius="md">
                  <Group gap="sm" align="flex-start">
                    <Badge variant="filled" color="cyan" size="sm" style={{ flexShrink: 0 }}>{item.label}</Badge>
                    <Text size="sm" c="dark">{item.desc}</Text>
                  </Group>
                </Paper>
              ))}
            </Stack>

            <Stack gap={4}>
              <Text size="sm" fw={600} c="dark">Ce qui est conservé vs réinitialisé</Text>
              <Table withTableBorder withColumnBorders fz="sm">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th c="green.7">Conservé</Table.Th>
                    <Table.Th c="red.7">Réinitialisé</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {([
                    { kept: 'Généalogie (arbre généalogique identique)', reset: 'Statistiques (Amour, Maturité, Endurance à 0)' },
                    { kept: 'Genre (Mâle ou Femelle)', reset: 'Sérénité (remise à une valeur aléatoire)' },
                    { kept: 'Type / Espèce', reset: 'Capacités spéciales (disparaissent au clonage)' },
                    { kept: '—', reset: 'Expérience (remise à zéro — niveau 1)' },
                  ] as const).map((row, i) => (
                    <Table.Tr key={i}>
                      <Table.Td>{row.kept}</Table.Td>
                      <Table.Td>{row.reset}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Stack>

            <Paper withBorder p="sm" radius="md" bg="red.0" style={{ borderColor: 'var(--mantine-color-red-4)' }}>
              <Text size="sm" c="dark">
                <Text component="span" fw={600} c="red">Attention :</Text> Le clone repart systématiquement au <Text component="span" fw={600}>niveau 1</Text>. Toute l'expérience accumulée par les deux montures sacrifiées est perdue. Anticipez cela dans votre planning d'élevage.
              </Text>
            </Paper>
          </Stack>
        </RuleBlock>

        <Paper withBorder p="sm" radius="md" bg="blue.0" style={{ borderColor: 'var(--mantine-color-blue-3)' }}>
          <Text size="sm" c="dark" ta="center">
            💡 Besoin d'aller plus loin ? Retrouvez toutes les subtilités de l'élevage sur{' '}
            <Anchor href="https://www.dofuspourlesnoobs.com/guide-de-l-eleveur.html" target="_blank" fw={600}>
              Dofus pour les Noobs
            </Anchor>.
          </Text>
        </Paper>

      </Stack>
    </Container>
  );
}
