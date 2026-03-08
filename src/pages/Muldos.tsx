import { muldos } from '@/data/mounts/muldos';
import { muldoAchievements, muldoMetaAchievement } from '@/data/achievements/muldos';
import { MountPageLayout } from '@/components/MountPageLayout';

export default function MuldosPage() {
  return (
    <MountPageLayout
      title="Élevage de Muldos"
      subtitle="Gérez votre élevage de Muldos : captures, accouplements, et inventaire."
      mounts={muldos}
      color="blue"
      achievements={muldoAchievements}
      metaAchievement={muldoMetaAchievement}
    />
  );
}
