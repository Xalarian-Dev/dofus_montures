import { Container, SimpleGrid, Card, Title, Text, Group, Stack, Image, Box, ThemeIcon, Divider, Badge, Paper, Anchor, Button } from '@mantine/core';
import { Link } from 'react-router-dom';
import { ArrowRight, BookCheck, Target, ArrowLeftRight, BookOpen, Calculator, Heart } from 'lucide-react';

const categories = [
  {
    href: '/dragodindes',
    label: 'Dragodindes',
    description: 'Montures terrestres',
    sprite: '/assets/sprites/dragodindes/amande.png',
    color: 'teal',
  },
  {
    href: '/muldos',
    label: 'Muldos',
    description: 'Montures aquatiques de Sufokia',
    sprite: '/assets/sprites/muldos/ebene.png',
    color: 'blue',
  },
  {
    href: '/volkornes',
    label: 'Volkornes',
    description: 'Montures de Brâkmar',
    sprite: '/assets/sprites/volkornes/ebene.png',
    color: 'violet',
  },
];

const features = [
  {
    icon: <BookCheck size={20} />,
    color: 'teal',
    title: 'Suivi d\'inventaire',
    description: 'Renseignez vos montures et succès que vous avez déjà obtenues. Votre progression est sauvegardée et accessible depuis n\'importe quel appareil.',
  },
  {
    icon: <Target size={20} />,
    color: 'orange',
    title: 'Stratégie d\'élevage',
    description: 'Définissez une monture cible ou un succès à débloquer. L\'outil génère automatiquement l\'ordre optimal des croisements à effectuer en tenant compte de ce que vous possédez déjà.',
  },
  {
    icon: <ArrowLeftRight size={20} />,
    color: 'grape',
    title: 'Échange entre joueurs',
    description: 'Proposez vos montures fertiles à l\'échange et indiquez ce que vous recherchez. Parcourez les offres des autres éleveurs de votre serveur et contactez-les directement.',
  },
  {
    icon: <BookOpen size={20} />,
    color: 'blue',
    title: 'Guide de référence',
    description: 'Toutes les mécaniques d\'élevage en un seul endroit : fertilité, sérénité, jauges d\'enclos, probabilités de génération, clonage et zones de capture.',
  },
  {
    icon: <Calculator size={20} />,
    color: 'orange',
    title: 'Calculateur d\'élevage',
    description: 'Estimez le temps nécessaire pour monter les stats de vos montures. Le planificateur complet gère la Sérénité automatiquement et exploite les zones de recouvrement pour gagner plusieurs stats en simultané.',
  },
];

export default function Home() {
  return (
    <Container size="lg" py={80}>
      <Stack gap={64}>

        {/* Hero */}
        <Stack align="center" gap="lg">
          <Title
            ta="center"
            style={{
              fontSize: 'clamp(32px, 5vw, 52px)',
              background: 'linear-gradient(135deg, #f97316, #eab308)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.15,
            }}
          >
            Dofus Tracker d'Élevage
          </Title>
          <Text ta="center" size="lg" c="dimmed" maw={520} lh={1.7}>
            Planifiez vos croisements, suivez votre collection et échangez avec d'autres éleveurs — pour chaque famille de montures.
          </Text>
        </Stack>

        {/* Features */}
        <Stack gap="md">
          <Group gap="sm" align="center">
            <Text fw={700} size="sm" c="dimmed" tt="uppercase" lts={1}>Fonctionnalités</Text>
            <Divider style={{ flex: 1 }} color="gray.2" />
          </Group>
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            {(features.length % 2 !== 0 ? features.slice(0, -1) : features).map(({ icon, color, title, description }) => (
              <Paper key={title} withBorder p="lg" radius="md">
                <Group gap="md" align="flex-start" wrap="nowrap">
                  <ThemeIcon color={color} variant="light" size={42} radius="md" style={{ flexShrink: 0 }}>
                    {icon}
                  </ThemeIcon>
                  <Stack gap={6}>
                    <Text fw={700} size="sm" c="dark">{title}</Text>
                    <Text size="sm" c="dimmed" lh={1.6}>{description}</Text>
                  </Stack>
                </Group>
              </Paper>
            ))}
          </SimpleGrid>
          {features.length % 2 !== 0 && (() => {
            const { icon, color, title, description } = features[features.length - 1];
            return (
              <Group justify="center">
                <Paper key={title} withBorder p="lg" radius="md" w={{ base: '100%', sm: 'calc(50% - var(--mantine-spacing-md) / 2)' }}>
                  <Group gap="md" align="flex-start" wrap="nowrap">
                    <ThemeIcon color={color} variant="light" size={42} radius="md" style={{ flexShrink: 0 }}>
                      {icon}
                    </ThemeIcon>
                    <Stack gap={6}>
                      <Text fw={700} size="sm" c="dark">{title}</Text>
                      <Text size="sm" c="dimmed" lh={1.6}>{description}</Text>
                    </Stack>
                  </Group>
                </Paper>
              </Group>
            );
          })()}
        </Stack>

        {/* Categories */}
        <Stack gap="md">
          <Group gap="sm" align="center">
            <Text fw={700} size="sm" c="dimmed" tt="uppercase" lts={1}>Familles de montures</Text>
            <Divider style={{ flex: 1 }} color="gray.2" />
          </Group>
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
            {categories.map(({ href, label, description, sprite, color }) => (
              <Card
                key={href}
                component={Link as any}
                to={href}
                withBorder
                padding="xl"
                radius="lg"
                td="none"
                style={{ transition: 'border-color 0.15s' }}
              >
                <Stack gap="md">
                  <Group justify="center">
                    <Image
                      src={sprite}
                      alt={label}
                      w={96}
                      h={96}
                      fit="contain"
                      loading="lazy"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  </Group>
                  <Stack gap={6}>
                    <Group justify="space-between" align="center">
                      <Title order={3} c="dark">{label}</Title>
                      <Box style={{ flexShrink: 0 }}>
                        <ArrowRight size={16} color="var(--mantine-color-gray-4)" />
                      </Box>
                    </Group>
                    <Text size="sm" c="dimmed" lh={1.6}>{description}</Text>
                  </Stack>
                  <Badge color={color} variant="light" size="xs" w="fit-content">Ouvrir</Badge>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        </Stack>

        {/* Ko-fi support */}
        <Anchor href="https://ko-fi.com/Xalarian" target="_blank" rel="noopener noreferrer" td="none">
          <Paper withBorder p="md" radius="md" bg="pink.0" style={{ borderColor: 'var(--mantine-color-pink-2)' }}>
            <Group justify="center" gap="sm">
              <Heart size={16} fill="var(--mantine-color-pink-5)" color="var(--mantine-color-pink-5)" />
              <Text size="sm" fw={600} c="pink.6">Soutenir le projet sur Ko-fi</Text>
              <Text size="xs" c="dimmed">— 100% gratuit, un café aide à couvrir les frais</Text>
            </Group>
          </Paper>
        </Anchor>

      </Stack>
    </Container>
  );
}
