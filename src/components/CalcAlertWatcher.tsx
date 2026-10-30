import { useEffect, useState } from 'react';
import { Button, Modal, Stack, Text } from '@mantine/core';
import { Bell } from 'lucide-react';
import { CALC_ALERT_EVENT, clearCalcAlert, readCalcAlert } from '@/lib/calcAlert';

const BLINK_MESSAGE = '🔔 Prête !';

/** Surveille l'alerte du calculateur, quelle que soit la page ouverte. */
export default function CalcAlertWatcher() {
  // Texte de l'alerte déclenchée ; tant qu'il est là, la fenêtre reste au centre de l'écran.
  const [ready, setReady] = useState<string | null>(null);

  useEffect(() => {
    let interval: number | undefined;

    function check() {
      const alert = readCalcAlert();
      if (!alert || alert.endAt > Date.now()) return;
      clearCalcAlert();
      setReady(alert.label);
    }

    function schedule() {
      if (interval !== undefined) window.clearInterval(interval);
      interval = readCalcAlert() ? window.setInterval(check, 1000) : undefined;
      check();
    }

    schedule();
    window.addEventListener(CALC_ALERT_EVENT, schedule);
    window.addEventListener('storage', schedule);
    return () => {
      window.removeEventListener(CALC_ALERT_EVENT, schedule);
      window.removeEventListener('storage', schedule);
      if (interval !== undefined) window.clearInterval(interval);
    };
  }, []);

  // Le titre de l'onglet clignote jusqu'à ce que le joueur ferme la fenêtre (même s'il regarde déjà le site).
  useEffect(() => {
    if (ready === null) return;
    const originalTitle = document.title;
    let on = false;
    const blink = window.setInterval(() => {
      on = !on;
      document.title = on ? BLINK_MESSAGE : originalTitle;
    }, 800);
    return () => {
      window.clearInterval(blink);
      document.title = originalTitle;
    };
  }, [ready]);

  return (
    <Modal
      opened={ready !== null}
      onClose={() => setReady(null)}
      centered
      size="sm"
      withCloseButton={false}
      closeOnClickOutside={false}
      title={
        <Text fw={700} size="lg">
          🔔 Ta monture est prête !
        </Text>
      }
    >
      <Stack>
        <Text>{ready}</Text>
        <Button leftSection={<Bell size={16} />} onClick={() => setReady(null)}>
          OK
        </Button>
      </Stack>
    </Modal>
  );
}
