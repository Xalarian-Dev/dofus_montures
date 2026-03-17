import { Box, Stack, Text, Anchor, Divider, SimpleGrid } from '@mantine/core';
import { Mail, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HEADER_GRADIENT } from '@/lib/constants';

const EMAIL = ['xalarian.dev', 'gmail.com'].join('@');

export function Footer() {
  function handleCookieReset() {
    localStorage.removeItem('cookie_consent');
    window.location.reload();
  }

  return (
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
  );
}
