import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Stack, Text, Title, Button, Group } from '@mantine/core';
import { Home as HomeIcon } from 'lucide-react';

interface NotFoundViewProps {
  title?: string;
  message?: string;
}

export function NotFoundView({
  title = 'Page introuvable',
  message = "Cette adresse ne mène à aucune page du site. Une faute de frappe, peut-être ?",
}: NotFoundViewProps) {
  // Une adresse inconnue ne doit pas être référencée par les moteurs de recherche.
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex';
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);

  return (
    <Container size="sm" py="xl">
      <Stack align="center" gap="md">
        <Title order={2}>{title}</Title>
        <Text c="dimmed" ta="center">{message}</Text>
        <Group justify="center" gap="sm">
          <Button component={Link as any} to="/" color="orange" leftSection={<HomeIcon size={14} />}>
            Accueil
          </Button>
          <Button component={Link as any} to="/dragodindes" variant="default">Dragodindes</Button>
          <Button component={Link as any} to="/muldos" variant="default">Muldos</Button>
          <Button component={Link as any} to="/volkornes" variant="default">Volkornes</Button>
        </Group>
      </Stack>
    </Container>
  );
}
