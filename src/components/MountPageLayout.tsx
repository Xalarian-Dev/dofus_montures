import { Container, Title, Text, Stack, Tabs, MantineColor } from '@mantine/core';
import { GenerationAchievement, MountSpecies } from '@/types/mount';
import { ResumeTab } from '@/components/ResumeTab';
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

        <Tabs defaultValue="resume" color={color}>
          <Tabs.List mb="lg">
            <Tabs.Tab value="resume">Résumé</Tabs.Tab>
            <Tabs.Tab value="objectifs">Objectifs</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="resume">
            <ResumeTab mounts={mounts} achievements={achievements} metaAchievement={metaAchievement} />
          </Tabs.Panel>

          <Tabs.Panel value="objectifs">
            <ObjectifsPage mounts={mounts} achievements={achievements} metaAchievement={metaAchievement} />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
}
