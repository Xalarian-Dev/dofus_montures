import { SimpleGrid, Paper, Stack, Text, Badge, Image } from '@mantine/core';
import { MountSpecies } from '@/types/mount';

interface CaptureGuideProps {
  mounts: MountSpecies[];
}

export function CaptureGuide({ mounts }: CaptureGuideProps) {
  const wildMounts = mounts.filter((m) => m.generation === 1);

  if (wildMounts.length === 0) {
    return <Text c="dimmed" fs="italic" size="sm">Aucune monture de base trouvée.</Text>;
  }

  return (
    <>
      <Text size="sm" c="dimmed" mb="sm">
        Pour démarrer votre élevage, obtenez ces montures de base :
      </Text>
      <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="sm">
        {wildMounts.map((mount) => (
          <Paper key={mount.id} withBorder p="md" radius="md" bg="white">
            <Stack gap={6} align="center">
              {mount.sprite && (
                <Image
                  src={mount.sprite}
                  alt={mount.name}
                  w={84}
                  h={84}
                  fit="contain"
                  style={{ imageRendering: 'pixelated' }}
                />
              )}
              <Text fw={600} size="xs" c="dark" ta="center" lh={1.3}>{mount.name}</Text>
              <Badge color="teal" variant="light" size="xs">Gén. 1</Badge>
            </Stack>
          </Paper>
        ))}
      </SimpleGrid>
    </>
  );
}
