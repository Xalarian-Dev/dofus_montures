import { useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import { CALC_ALERT_EVENT, clearCalcAlert, readCalcAlert } from '@/lib/calcAlert';

const BLINK_MESSAGE = '🔔 Prête !';

/** Surveille l'alerte du calculateur, quelle que soit la page ouverte. */
export default function CalcAlertWatcher() {
  useEffect(() => {
    let interval: number | undefined;
    let blink: number | undefined;
    const originalTitle = document.title;

    function stopBlink() {
      if (blink === undefined) return;
      window.clearInterval(blink);
      blink = undefined;
      document.title = originalTitle;
    }

    function startBlink() {
      if (blink !== undefined) return;
      let on = false;
      blink = window.setInterval(() => {
        on = !on;
        document.title = on ? BLINK_MESSAGE : originalTitle;
      }, 1000);
      // Le clignotement s'arrête dès que le joueur revient sur l'onglet.
      const stop = () => {
        if (document.visibilityState === 'hidden') return;
        stopBlink();
        window.removeEventListener('focus', stop);
        document.removeEventListener('visibilitychange', stop);
      };
      window.addEventListener('focus', stop);
      document.addEventListener('visibilitychange', stop);
      if (document.visibilityState !== 'hidden' && document.hasFocus()) stop();
    }

    function check() {
      const alert = readCalcAlert();
      if (!alert || alert.endAt > Date.now()) return;
      clearCalcAlert();
      notifications.show({
        title: 'Ta monture est prête',
        message: alert.label,
        color: 'orange',
        autoClose: false,
      });
      startBlink();
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
      stopBlink();
    };
  }, []);

  return null;
}
