import { Box, Group, Title, Text, Anchor, Button, Modal, Stack, Divider, Avatar, Indicator, Burger, Drawer } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, useLocation } from 'react-router-dom';
import { LogIn, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMessagesContext } from '@/contexts/MessagesContext';

const links = [
  { href: '/dragodindes', label: 'Dragodindes' },
  { href: '/muldos', label: 'Muldos' },
  { href: '/volkornes', label: 'Volkornes' },
  { href: '/caracteristiques', label: 'Caractéristiques' },
  { href: '/calculateur', label: 'Calculateur' },
  { href: '/guide', label: 'Guide' },
  { href: '/echange', label: 'Échange', badge: true },
];

export function Navigation() {
  const { pathname } = useLocation();
  const { user, signInWithGoogle, signInWithDiscord, signOut } = useAuth();
  const [loginOpened, { open: openLogin, close: closeLogin }] = useDisclosure(false);
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const { unreadTotal } = useMessagesContext();

  const navLink = (link: typeof links[number], mobile = false) => (
    <Anchor
      key={link.href}
      component={Link as any}
      to={link.href}
      fw={600}
      size={mobile ? 'md' : 'sm'}
      className={mobile ? undefined : 'nav-link'}
      data-active={pathname === link.href || undefined}
      onClick={mobile ? closeDrawer : undefined}
      style={mobile ? {
        display: 'block',
        padding: '10px 12px',
        borderRadius: 8,
        color: 'var(--mantine-color-dark-7)',
        textDecoration: 'none',
        backgroundColor: pathname === link.href ? 'var(--mantine-color-orange-1)' : undefined,
      } : undefined}
    >
      {link.badge && unreadTotal > 0 ? (
        <Indicator color="red" size={8} offset={-2} label={unreadTotal > 9 ? '9+' : unreadTotal} processing>
          {link.label}
        </Indicator>
      ) : link.label}
    </Anchor>
  );

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

        {/* Center: nav links (desktop only) */}
        <Group gap={4} visibleFrom="sm">
          {links.map((link) => navLink(link))}
        </Group>

        {/* Right: auth + burger */}
        <Group justify="flex-end" gap="sm">
          {user ? (
            <>
              <Anchor component={Link as any} to="/profil" td="none" style={{ lineHeight: 0 }} visibleFrom="sm">
                <Group gap={6} align="center">
                  <Avatar size="sm" radius="xl" style={{ cursor: 'pointer' }}>
                    <img
                      src={user.user_metadata?.avatar_url}
                      alt={user.user_metadata?.full_name}
                      referrerPolicy="no-referrer"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Avatar>
                  <Text size="xs" fw={600} c="white">Profil</Text>
                </Group>
              </Anchor>
              <Button
                variant="white"
                color="orange"
                size="sm"
                radius="md"
                leftSection={<LogOut size={16} />}
                onClick={signOut}
                visibleFrom="sm"
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
              onClick={openLogin}
              visibleFrom="sm"
            >
              Connexion
            </Button>
          )}
          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            hiddenFrom="sm"
            color="white"
            size="sm"
          />
        </Group>
      </Box>

      {/* Mobile drawer */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="xs"
        title={<Text fw={700} size="lg">Menu</Text>}
        hiddenFrom="sm"
        zIndex={1000}
      >
        <Stack gap={4}>
          {links.map((link) => navLink(link, true))}
        </Stack>
        <Divider my="md" />
        {user ? (
          <Stack gap="sm">
            <Anchor component={Link as any} to="/profil" td="none" onClick={closeDrawer}>
              <Group gap={8}>
                <Avatar size="sm" radius="xl">
                  <img
                    src={user.user_metadata?.avatar_url}
                    alt={user.user_metadata?.full_name}
                    referrerPolicy="no-referrer"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Avatar>
                <Text size="sm" fw={600}>Profil</Text>
              </Group>
            </Anchor>
            <Button
              variant="light"
              color="red"
              size="sm"
              radius="md"
              leftSection={<LogOut size={16} />}
              onClick={() => { signOut(); closeDrawer(); }}
            >
              Déconnexion
            </Button>
          </Stack>
        ) : (
          <Button
            fullWidth
            variant="light"
            color="orange"
            size="sm"
            radius="md"
            leftSection={<LogIn size={16} />}
            onClick={() => { openLogin(); closeDrawer(); }}
          >
            Connexion
          </Button>
        )}
      </Drawer>

      <Modal opened={loginOpened} onClose={closeLogin} title="Connexion" centered size="sm">
        <Stack gap="md">
          <Text size="sm" c="dimmed" ta="center">
            Connectez-vous pour sauvegarder votre progression sur tous vos appareils.
          </Text>
          <Divider />
          <Button
            fullWidth
            variant="default"
            size="md"
            onClick={() => { signInWithGoogle(); closeLogin(); }}
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
            onClick={() => { signInWithDiscord(); closeLogin(); }}
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
