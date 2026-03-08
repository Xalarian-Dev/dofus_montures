import { ObjectifsPage } from '@/components/ObjectifsPage';
import { dragodindes } from '@/data/mounts/dragodindes';
import { muldos } from '@/data/mounts/muldos';
import { volkornes } from '@/data/mounts/volkornes';

const allMounts = [...dragodindes, ...muldos, ...volkornes];

export default function Objectifs() {
  return <ObjectifsPage mounts={allMounts} />;
}
