import { dragodindes } from '@/data/mounts/dragodindes';
import { dragodindAchievements, dragodindMetaAchievement } from '@/data/achievements/dragodindes';
import { MountPageLayout } from '@/components/MountPageLayout';

export default function DragodindesPage() {
  return (
    <MountPageLayout
      title="Élevage de Dragodindes"
      subtitle="Gérez votre élevage de Dragodindes : captures, accouplements, et inventaire."
      mounts={dragodindes}
      color="teal"
      achievements={dragodindAchievements}
      metaAchievement={dragodindMetaAchievement}
    />
  );
}
