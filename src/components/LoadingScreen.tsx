import { Center, Loader, Stack, Text } from '@mantine/core';

export function LoadingScreen() {
  return (
    <Center h="100vh">
      <Stack align="center" gap="sm">
        <Loader color="orange" size="lg" />
        <Text size="sm" c="dimmed">Chargement...</Text>
      </Stack>
    </Center>
  );
}
