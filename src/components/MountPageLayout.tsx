import { Container, Title, Text, Stack, Tabs, MantineColor } from '@mantine/core';
import { GenerationAchievement, MountSpecies } from '@/types/mount';
import { InventoryPage } from '@/components/InventoryPage';
import { ObjectifsPage } from '@/components/ObjectifsPage';

interface MountPageLayoutProps {
  title: string;
  subtitle: string;
  mounts: MountSpecies[];
  color: MantineColor;
  achievements?: Record<number, GenerationAchievement>;
  metaAchievement?: GenerationAchievement;
}

export function MountPageLayout({ title, subtitle, mounts, color, achievements, metaAchievement }: MountPageLayoutProps) {
  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Stack gap={4}>
          <Title order={1} c="dark">{title}</Title>
          <Text c="dimmed">{subtitle}</Text>
        </Stack>

        <Tabs defaultValue="inventaire" color={color}>
          <Tabs.List mb="lg">
            <Tabs.Tab value="inventaire">Inventaire</Tabs.Tab>
            <Tabs.Tab value="objectifs">Objectifs</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="inventaire">
            <InventoryPage mounts={mounts} achievements={achievements} metaAchievement={metaAchievement} />
          </Tabs.Panel>

          <Tabs.Panel value="objectifs">
            <ObjectifsPage mounts={mounts} achievements={achievements} metaAchievement={metaAchievement} />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
}
