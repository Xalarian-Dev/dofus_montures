import { volkornes } from '@/data/mounts/volkornes';
import { volkskorneAchievements, volkskorneMetaAchievement } from '@/data/achievements/volkornes';
import { MountPageLayout } from '@/components/MountPageLayout';

export default function VolkornesPage() {
  return (
    <MountPageLayout
      title="Élevage de Volkornes"
      subtitle="Gérez votre élevage de Volkornes : captures, accouplements, et inventaire."
      mounts={volkornes}
      color="red"
      achievements={volkskorneAchievements}
      metaAchievement={volkskorneMetaAchievement}
    />
  );
}
