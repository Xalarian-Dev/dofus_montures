import { Box, Group, Title, Text, Anchor, Button, Modal, Stack, Divider, Avatar, Indicator } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, useLocation } from 'react-router-dom';
import { LogIn, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMessages } from '@/hooks/useMessages';

const links = [
  { href: '/dragodindes', label: 'Dragodindes' },
  { href: '/muldos', label: 'Muldos' },
  { href: '/volkornes', label: 'Volkornes' },
  { href: '/caracteristiques', label: 'Caractéristiques' },
  { href: '/guide', label: 'Guide' },
  { href: '/echange', label: 'Échange', badge: true },
];

export function Navigation() {
  const { pathname } = useLocation();
  const { user, signInWithGoogle, signInWithDiscord, signOut } = useAuth();
  const [opened, { open, close }] = useDisclosure(false);
  const { unreadTotal } = useMessages(user?.id);

  return (
    <>
      <Box
        h="100%"
        px="xl"
        style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}
      >
        {/* Left: logo */}
        <Anchor component={Link as any} to="/" td="none">
          <Title order={4} c="white" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
            Dofus Montures
          </Title>
          <Text size="xs" c="orange.1" visibleFrom="sm">Tracker de progression</Text>
        </Anchor>

        {/* Center: nav links */}
        <Group gap={4}>
          {links.map((link) => (
            <Anchor
              key={link.href}
              component={Link as any}
              to={link.href}
              fw={600}
              size="sm"
              className="nav-link"
              data-active={pathname === link.href || undefined}
            >
              {link.badge && unreadTotal > 0 ? (
                <Indicator color="red" size={8} offset={-2} label={unreadTotal > 9 ? '9+' : unreadTotal} processing>
                  {link.label}
                </Indicator>
              ) : link.label}
            </Anchor>
          ))}
        </Group>

        {/* Right: auth */}
        <Group justify="flex-end" gap="sm">
          {user ? (
            <>
              <Avatar size="sm" radius="xl">
                <img
                  src={user.user_metadata?.avatar_url}
                  alt={user.user_metadata?.full_name}
                  referrerPolicy="no-referrer"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Avatar>
              <Button
                variant="white"
                color="orange"
                size="sm"
                radius="md"
                leftSection={<LogOut size={16} />}
                onClick={signOut}
              >
                Déconnexion
              </Button>
            </>
          ) : (
            <Button
              variant="white"
              color="orange"
              size="sm"
              radius="md"
              leftSection={<LogIn size={16} />}
              onClick={open}
            >
              Connexion
            </Button>
          )}
        </Group>
      </Box>

      <Modal opened={opened} onClose={close} title="Connexion" centered size="sm">
        <Stack gap="md">
          <Text size="sm" c="dimmed" ta="center">
            Connectez-vous pour sauvegarder votre progression sur tous vos appareils.
          </Text>
          <Divider />
          <Button
            fullWidth
            variant="default"
            size="md"
            onClick={() => { signInWithGoogle(); close(); }}
            leftSection={
              <img src="https://www.google.com/favicon.ico" width={16} height={16} alt="Google" />
            }
          >
            Continuer avec Google
          </Button>
          <Button
            fullWidth
            size="md"
            color="indigo"
            onClick={() => { signInWithDiscord(); close(); }}
            leftSection={
              <img src="https://discord.com/assets/favicon.ico" width={16} height={16} alt="Discord" />
            }
          >
            Continuer avec Discord
          </Button>
        </Stack>
      </Modal>
    </>
  );
}
