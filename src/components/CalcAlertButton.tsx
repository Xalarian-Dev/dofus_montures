import { useEffect, useState } from 'react';
import { Button, Group, Text } from '@mantine/core';
import { Bell, BellOff } from 'lucide-react';
import { CALC_ALERT_EVENT, clearCalcAlert, readCalcAlert, saveCalcAlert } from '@/lib/calcAlert';

interface Props {
  endAt: number;
  label: string;
}

/** Bouton « Créer une alerte » placé sous l'heure de fin du calculateur. */
export default function CalcAlertButton({ endAt, label }: Props) {
  const [alert, setAlert] = useState(readCalcAlert);

  useEffect(() => {
    const refresh = () => setAlert(readCalcAlert());
    window.addEventListener(CALC_ALERT_EVENT, refresh);
    return () => window.removeEventListener(CALC_ALERT_EVENT, refresh);
  }, []);

  const isThisAlert = alert?.endAt === endAt;

  if (isThisAlert) {
    return (
      <Group gap="sm">
        <Text size="xs" c="dimmed">Alerte créée : garde cet onglet du site ouvert.</Text>
        <Button size="xs" variant="subtle" color="gray" leftSection={<BellOff size={14} />} onClick={clearCalcAlert}>
          Annuler l'alerte
        </Button>
      </Group>
    );
  }

  return (
    <Button
      size="xs"
      variant="light"
      color="orange"
      leftSection={<Bell size={14} />}
      onClick={() => saveCalcAlert({ endAt, label })}
    >
      {alert ? "Remplacer l'alerte" : 'Créer une alerte'}
    </Button>
  );
}
