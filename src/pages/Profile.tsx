import { useState, useEffect } from 'react';
import {
  Container, Title, Text, Stack, Paper, Group, Avatar, TextInput, Button,
  Switch, Divider, Badge, Modal, Box, Alert, Select,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { User, Eye, Swords, RotateCcw, Trash2, AlertTriangle, Globe } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useBreedingStore } from '@/store/useBreedingStore';
import { useNavigate } from 'react-router-dom';
import { DOFUS_REALMS } from '@/data/realms';

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { profile, loading, saving, saveUsername, saveIngameName, saveRealm, saveVisibility, deleteAccount } = useProfile(user?.id);
  const resetAll = useBreedingStore((s) => s.resetAll);

  const [username, setUsername] = useState('');
  const [ingameName, setIngameName] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [usernameSuccess, setUsernameSuccess] = useState(false);
  const [ingameSuccess, setIngameSuccess] = useState(false);

  const [resetOpened, { open: openReset, close: closeReset }] = useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);

  // Sync inputs with loaded profile
  useEffect(() => {
    if (!loading) {
      setUsername(profile.username);
      setIngameName(profile.ingameName);
    }
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return (
      <Container size="sm" py="xl">
        <Alert color="orange" title="Non connecté">
          Vous devez être connecté pour accéder à votre profil.
        </Alert>
      </Container>
    );
  }

  const displayName = user.user_metadata?.full_name ?? user.email ?? 'Joueur';

  async function handleSaveUsername() {
    setUsernameError('');
    setUsernameSuccess(false);
    if (!username.trim()) { setUsernameError('Le nom ne peut pas être vide.'); return; }
    if (username.length < 3) { setUsernameError('Minimum 3 caractères.'); return; }
    const result = await saveUsername(username.trim());
    if (result === 'taken') setUsernameError('Ce nom est déjà utilisé.');
    else if (result === 'error') setUsernameError('Erreur lors de la sauvegarde.');
    else setUsernameSuccess(true);
  }

  async function handleSaveIngameName() {
    setIngameSuccess(false);
    await saveIngameName(ingameName.trim());
    setIngameSuccess(true);
  }

  async function handleReset() {
    if (user) await resetAll(user.id);
    closeReset();
  }

  async function handleDelete() {
    setDeleting(true);
    const ok = await deleteAccount();
    if (ok) navigate('/');
    else setDeleting(false);
  }

  return (
    <Container size="sm" py="xl">
      <Stack gap="xl">
        <Title order={1} c="dark">Mon profil</Title>

        {/* Identity */}
        <Paper withBorder p="lg" radius="md">
          <Stack gap="md">
            <Group gap="sm">
              <Avatar size="lg" radius="xl">
                {user.user_metadata?.avatar_url
                  ? <img src={user.user_metadata.avatar_url} alt={displayName} referrerPolicy="no-referrer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <User size={24} />
                }
              </Avatar>
              <Stack gap={2}>
                <Text fw={700}>{displayName}</Text>
                <Badge variant="light" color="orange" size="xs">
                  {user.app_metadata?.provider === 'discord' ? 'Discord' : 'Google'}
                </Badge>
              </Stack>
            </Group>

            <Divider />

            <Stack gap="xs">
              <Text size="sm" fw={600}>Nom public</Text>
              <Text size="xs" c="dimmed">Affiché dans la page Échange. Doit être unique.</Text>
              <Group gap="sm" align="flex-start">
                <TextInput
                  placeholder={profile.username || 'Choisir un nom...'}
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setUsernameError(''); setUsernameSuccess(false); }}
                  error={usernameError}
                  style={{ flex: 1 }}
                  maxLength={32}
                />
                <Button color="orange" onClick={handleSaveUsername} loading={saving}>
                  Sauvegarder
                </Button>
              </Group>
              {usernameSuccess && <Text size="xs" c="teal">Nom mis à jour !</Text>}
            </Stack>
          </Stack>
        </Paper>

        {/* In-game name */}
        <Paper withBorder p="lg" radius="md">
          <Stack gap="md">
            <Group gap="xs">
              <Swords size={18} />
              <Text fw={600}>Pseudo en jeu</Text>
            </Group>
            <Text size="xs" c="dimmed">
              Affiché aux autres joueurs pour vous contacter via le /chuchotement en jeu.
            </Text>
            <Group gap="sm" align="flex-start">
              <TextInput
                placeholder="Votre pseudo Dofus..."
                value={ingameName}
                onChange={(e) => { setIngameName(e.target.value); setIngameSuccess(false); }}
                style={{ flex: 1 }}
                maxLength={64}
              />
              <Button color="orange" onClick={handleSaveIngameName} loading={saving}>
                Sauvegarder
              </Button>
            </Group>
            {ingameSuccess && <Text size="xs" c="teal">Pseudo mis à jour !</Text>}
          </Stack>
        </Paper>

        {/* Realm */}
        <Paper withBorder p="lg" radius="md">
          <Stack gap="md">
            <Group gap="xs">
              <Globe size={18} />
              <Text fw={600}>Serveur de jeu</Text>
            </Group>
            <Text size="xs" c="dimmed">
              Seuls les joueurs du même serveur apparaîtront dans la page Échange.
            </Text>
            <Select
              placeholder="Choisir un serveur..."
              data={DOFUS_REALMS}
              value={profile.realm || null}
              onChange={(val) => saveRealm(val ?? '')}
              searchable
              clearable
            />
          </Stack>
        </Paper>

        {/* Visibility */}
        <Paper withBorder p="lg" radius="md">
          <Group justify="space-between">
            <Box>
              <Group gap="xs" mb={4}>
                <Eye size={18} />
                <Text fw={600}>Visible dans Échange</Text>
              </Group>
              <Text size="xs" c="dimmed">
                Si désactivé, vos annonces n'apparaissent plus pour les autres joueurs.
              </Text>
            </Box>
            <Switch
              checked={profile.isVisible}
              onChange={(e) => saveVisibility(e.currentTarget.checked)}
              color="orange"
              size="md"
            />
          </Group>
        </Paper>

        {/* Danger zone */}
        <Paper withBorder p="lg" radius="md" style={{ borderColor: 'var(--mantine-color-red-3)' }}>
          <Stack gap="md">
            <Group gap="xs">
              <AlertTriangle size={18} color="var(--mantine-color-red-6)" />
              <Text fw={600} c="red">Zone dangereuse</Text>
            </Group>
            <Divider />

            <Group justify="space-between" align="flex-start">
              <Box>
                <Text size="sm" fw={500}>Réinitialiser la progression</Text>
                <Text size="xs" c="dimmed">Efface tout l'inventaire et les objectifs. Irréversible.</Text>
              </Box>
              <Button color="orange" variant="light" leftSection={<RotateCcw size={14} />} onClick={openReset}>
                Réinitialiser
              </Button>
            </Group>

            <Divider />

            <Group justify="space-between" align="flex-start">
              <Box>
                <Text size="sm" fw={500}>Supprimer le compte</Text>
                <Text size="xs" c="dimmed">Supprime toutes vos données. Action irréversible.</Text>
              </Box>
              <Button color="red" variant="light" leftSection={<Trash2 size={14} />} onClick={openDelete}>
                Supprimer
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Stack>

      {/* Reset confirmation */}
      <Modal opened={resetOpened} onClose={closeReset} title="Réinitialiser la progression" centered size="sm">
        <Stack gap="md">
          <Text size="sm">
            Êtes-vous sûr ? Tout votre inventaire et vos objectifs seront effacés définitivement.
          </Text>
          <Group justify="flex-end" gap="sm">
            <Button variant="default" onClick={closeReset}>Annuler</Button>
            <Button color="orange" onClick={handleReset}>Réinitialiser</Button>
          </Group>
        </Stack>
      </Modal>

      {/* Delete confirmation */}
      <Modal opened={deleteOpened} onClose={closeDelete} title="Supprimer le compte" centered size="sm">
        <Stack gap="md">
          <Text size="sm">
            Cette action est <strong>irréversible</strong>. Toutes vos données seront supprimées.
            Tapez <strong>SUPPRIMER</strong> pour confirmer.
          </Text>
          <TextInput
            placeholder="SUPPRIMER"
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
          />
          <Group justify="flex-end" gap="sm">
            <Button variant="default" onClick={closeDelete}>Annuler</Button>
            <Button
              color="red"
              loading={deleting}
              disabled={deleteConfirm !== 'SUPPRIMER'}
              onClick={handleDelete}
            >
              Supprimer définitivement
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
