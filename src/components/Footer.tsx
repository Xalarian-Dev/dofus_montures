import { Box, Stack, Text, Anchor, Divider, SimpleGrid, Modal, List, Badge, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Mail, Heart, ScrollText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HEADER_GRADIENT } from '@/lib/constants';

const EMAIL = ['xalarian.dev', 'gmail.com'].join('@');

const changelog = [
  {
    version: '0.5',
    date: '4 avril 2026',
    changes: [
      'Stratégie Optimisée améliorée — pour les Muldos et Volkornes (recettes multiples), le mode choisit maintenant les combinaisons qui partagent le plus de parents avec vos autres objectifs, réduisant le nombre de reproductions inutiles',
    ],
  },
  {
    version: '0.4',
    date: '19 mars 2026',
    changes: [
      'Ajout de la probabilité de génération supérieure — estimez le nombre d\'essais nécessaires selon votre taux de réussite',
      'Compteurs ♂/♀ sur chaque étape de la stratégie pour suivre votre avancement',
      'Les options de stratégie (clonage, mode, masquer terminées) sont regroupées au même endroit',
      'Sauvegarde optimisée — moins d\'appels serveur, interface plus réactive',
      'Ajout du bouton Ko-fi pour soutenir le projet',
    ],
  },
  {
    version: '0.3',
    date: '15 mars 2026',
    changes: [
      'Stratégie d\'élevage avec mode Simple et Optimisé',
      'Système d\'objectifs par monture ou par succès',
      'Option de clonage dans la stratégie',
      'Navigation mobile avec menu hamburger',
    ],
  },
  {
    version: '0.2',
    date: '10 mars 2026',
    changes: [
      'Système d\'échange entre joueurs',
      'Messagerie intégrée pour contacter les éleveurs',
      'Guide de référence sur les mécaniques d\'élevage',
      'Calculateur de stats de montures',
    ],
  },
  {
    version: '0.1',
    date: '5 mars 2026',
    changes: [
      'Lancement du site — suivi d\'inventaire pour Dragodindes, Muldos et Volkornes',
      'Connexion via Google et Discord',
      'Sauvegarde de la progression sur tous les appareils',
    ],
  },
];

export function Footer() {
  const [changelogOpened, { open: openChangelog, close: closeChangelog }] = useDisclosure(false);

  function handleCookieReset() {
    localStorage.removeItem('cookie_consent');
    window.location.reload();
  }

  return (
    <>
      <Box
        mt="xl"
        style={{
          background: HEADER_GRADIENT,
          color: 'white',
        }}
      >
        <Box px="xl" py="xl" maw={1200} mx="auto">
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">

            {/* Brand */}
            <Stack gap="xs">
              <Text fw={800} size="lg" c="white">Dofus Montures</Text>
              <Text size="sm" c="orange.2">
                Tracker de progression pour vos montures Dragodindes, Muldos et Volkornes.
              </Text>
            </Stack>

            {/* Legal */}
            <Stack gap="xs">
              <Text fw={700} size="sm" c="orange.3" tt="uppercase" lts={1}>Légal</Text>
              <Anchor
                component={Link as any}
                to="/mentions-legales"
                size="sm"
                c="orange.1"
                style={{ textDecoration: 'none' }}
              >
                Mentions légales
              </Anchor>
              <Anchor
                component={Link as any}
                to="/politique-de-confidentialite"
                size="sm"
                c="orange.1"
                style={{ textDecoration: 'none' }}
              >
                Politique de confidentialité
              </Anchor>
              <Anchor
                size="sm"
                c="orange.1"
                style={{ textDecoration: 'none', cursor: 'pointer' }}
                onClick={handleCookieReset}
              >
                Gérer les cookies
              </Anchor>
            </Stack>

            {/* About */}
            <Stack gap="xs">
              <Text fw={700} size="sm" c="orange.3" tt="uppercase" lts={1}>Contact</Text>
              <Anchor
                href={`mailto:${EMAIL}`}
                size="sm"
                c="orange.1"
                style={{ textDecoration: 'none' }}
              >
                <Mail size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                Nous contacter
              </Anchor>
              <Text size="sm" c="orange.2">
                Créé par{' '}
                <Anchor
                  href="https://github.com/Xalarian-Dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  c="orange.0"
                  fw={600}
                  style={{ textDecoration: 'none' }}
                >
                  Xalarian
                </Anchor>
              </Text>
              <Anchor
                href="https://ko-fi.com/Xalarian"
                target="_blank"
                rel="noopener noreferrer"
                size="sm"
                c="orange.1"
                style={{ textDecoration: 'none' }}
              >
                <Heart size={14} fill="currentColor" style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                Soutenir sur Ko-fi
              </Anchor>
              <Anchor
                size="sm"
                c="orange.1"
                style={{ textDecoration: 'none', cursor: 'pointer' }}
                onClick={openChangelog}
              >
                <ScrollText size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                Nouveautés
              </Anchor>
            </Stack>
          </SimpleGrid>
        </Box>

        <Divider color="orange.8" />

        <Box px="xl" py="sm" maw={1200} mx="auto">
          <Stack gap={4} align="center">
            <Text size="xs" c="orange.3">
              © {new Date().getFullYear()} Dofus Montures. Tous droits réservés.
            </Text>
            <Text size="xs" c="orange.4" ta="center">
              Dofus et tous les noms associés sont des marques déposées d'Ankama Games. Ce site est un projet communautaire non officiel.
            </Text>
          </Stack>
        </Box>
      </Box>

      <Modal opened={changelogOpened} onClose={closeChangelog} title="Nouveautés" centered size="lg">
        <Stack gap="lg">
          {changelog.map((release) => (
            <Stack key={release.version} gap="xs">
              <Group gap="xs">
                <Badge color="orange" variant="light" size="sm">v{release.version}</Badge>
                <Text size="xs" c="dimmed">{release.date}</Text>
              </Group>
              <List size="sm" spacing={4}>
                {release.changes.map((change, i) => (
                  <List.Item key={i}>{change}</List.Item>
                ))}
              </List>
            </Stack>
          ))}
        </Stack>
      </Modal>
    </>
  );
}
