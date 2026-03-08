import { Container, SimpleGrid, Card, Title, Text, Group, Stack, Image, Box } from '@mantine/core';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    href: '/dragodindes',
    label: 'Dragodindes',
    description: 'Montures terrestres de base. Arbre généalogique complet avec croisements classiques.',
    sprite: '/assets/sprites/dragodindes/amande.png',
  },
  {
    href: '/muldos',
    label: 'Muldos',
    description: 'Montures aquatiques. Gestion des croisements spécifiques et capacités de nage.',
    sprite: '/assets/sprites/muldos/ebene.png',
  },
  {
    href: '/volkornes',
    label: 'Volkornes',
    description: 'Montures divines. Système génétique complexe et mutations rares.',
    sprite: '/assets/sprites/volkornes/ebene.png',
  },
];

export default function Home() {
  return (
    <Container size="lg" py={80}>
      <Stack align="center" gap="xl" mb={60}>
        <Title
          ta="center"
          style={{
            fontSize: 48,
            background: 'linear-gradient(135deg, #f97316, #eab308)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Dofus Tracker d'Élevage
        </Title>
        <Text ta="center" size="xl" c="dimmed" maw={500}>
          Optimisez votre élevage et débloquez toutes les générations.
          Suivez efficacement vos captures et accouplements.
        </Text>
      </Stack>

      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
        {categories.map(({ href, label, description, sprite }) => (
          <Card
            key={href}
            component={Link as any}
            to={href}
            withBorder
            padding="xl"
            radius="lg"
            td="none"
          >
            <Group justify="center" mb="md">
              <Image
                src={sprite}
                alt={label}
                w={120}
                h={120}
                fit="contain"
                loading="lazy"
                style={{ imageRendering: 'pixelated' }}
              />
            </Group>
            <Group justify="space-between" align="flex-start">
              <Stack gap={4} flex={1}>
                <Title order={3} c="dark">{label}</Title>
                <Text size="sm" c="dimmed" lh={1.6}>{description}</Text>
              </Stack>
              <Box mt={4} style={{ flexShrink: 0 }}>
                <ArrowRight size={18} color="var(--mantine-color-gray-4)" />
              </Box>
            </Group>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
}
