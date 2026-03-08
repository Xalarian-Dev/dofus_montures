import { useState } from 'react';
import { Paper, Group, Text, Button, Stack, Modal, Switch, Divider, Anchor, Box } from '@mantine/core';
import { Cookie } from 'lucide-react';

const STORAGE_KEY = 'cookie_consent';

type ConsentState = {
  necessary: true;
  functional: boolean;
};

function loadConsent(): ConsentState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveConsent(consent: ConsentState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
}

export function CookieBanner() {
  const [consent, setConsent] = useState<ConsentState | null>(loadConsent);
  const [modalOpen, setModalOpen] = useState(false);
  const [functionalChecked, setFunctionalChecked] = useState(true);

  if (consent !== null) return null;

  function acceptAll() {
    const c: ConsentState = { necessary: true, functional: true };
    saveConsent(c);
    setConsent(c);
  }

  function refuseAll() {
    const c: ConsentState = { necessary: true, functional: false };
    saveConsent(c);
    setConsent(c);
  }

  function savePreferences() {
    const c: ConsentState = { necessary: true, functional: functionalChecked };
    saveConsent(c);
    setConsent(c);
    setModalOpen(false);
  }

  return (
    <>
      <Paper
        withBorder
        shadow="lg"
        p="md"
        radius="md"
        style={{
          position: 'fixed',
          bottom: 16,
          left: 16,
          right: 16,
          zIndex: 9999,
          maxWidth: 680,
          margin: '0 auto',
        }}
      >
        <Stack gap="sm">
          <Group gap="sm" align="flex-start" wrap="nowrap">
            <Cookie size={20} style={{ flexShrink: 0, marginTop: 2 }} color="var(--mantine-color-orange-6)" />
            <Stack gap={4}>
              <Text fw={700} size="sm">Ce site utilise des cookies</Text>
              <Text size="xs" c="dimmed">
                Nous utilisons des cookies nécessaires au fonctionnement du site (authentification, sauvegarde de progression)
                et des cookies fonctionnels pour améliorer votre expérience. Aucune donnée n'est transmise à des tiers à des fins publicitaires.
              </Text>
            </Stack>
          </Group>
          <Group justify="flex-end" gap="xs" wrap="wrap">
            <Anchor size="xs" c="dimmed" onClick={() => setModalOpen(true)} style={{ cursor: 'pointer' }}>
              Personnaliser
            </Anchor>
            <Button size="xs" variant="default" onClick={refuseAll}>
              Refuser
            </Button>
            <Button size="xs" color="orange" onClick={acceptAll}>
              Tout accepter
            </Button>
          </Group>
        </Stack>
      </Paper>

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Gestion des cookies"
        centered
        size="sm"
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Choisissez les catégories de cookies que vous acceptez. Vous pouvez modifier vos préférences à tout moment.
          </Text>
          <Divider />

          <Stack gap="xs">
            <Group justify="space-between">
              <Box>
                <Text size="sm" fw={600}>Cookies nécessaires</Text>
                <Text size="xs" c="dimmed">Authentification et sauvegarde de progression. Indispensables au fonctionnement.</Text>
              </Box>
              <Switch checked disabled size="sm" color="orange" />
            </Group>

            <Divider />

            <Group justify="space-between">
              <Box>
                <Text size="sm" fw={600}>Cookies fonctionnels</Text>
                <Text size="xs" c="dimmed">Mémorisation de vos préférences d'affichage et paramètres de navigation.</Text>
              </Box>
              <Switch
                checked={functionalChecked}
                onChange={(e) => setFunctionalChecked(e.currentTarget.checked)}
                size="sm"
                color="orange"
              />
            </Group>
          </Stack>

          <Divider />
          <Group justify="flex-end" gap="xs">
            <Button variant="default" size="sm" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button color="orange" size="sm" onClick={savePreferences}>Enregistrer</Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
