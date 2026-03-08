import { Container, Title, Text, Stack, Divider } from '@mantine/core';

export default function PolitiqueConfidentialite() {
  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <Stack gap="xs">
          <Title order={1} c="dark">Politique de confidentialité</Title>
          <Text c="dimmed" size="sm">Dernière mise à jour : mars 2026</Text>
        </Stack>

        <Divider />

        <Stack gap="md">
          <Title order={3}>1. Qui sommes-nous ?</Title>
          <Text size="sm" c="dimmed">
            Dofus Montures est un projet communautaire non officiel permettant aux joueurs de Dofus de suivre
            leur progression dans l'élevage de montures (Dragodindes, Muldos, Volkornes).
            Ce site n'est pas affilié à Ankama Games.
          </Text>
        </Stack>

        <Stack gap="md">
          <Title order={3}>2. Données collectées</Title>
          <Text size="sm" c="dimmed">
            Lorsque vous vous connectez via Google ou Discord, nous collectons les informations suivantes
            fournies par ces services :
          </Text>
          <Stack gap="xs" pl="md">
            <Text size="sm" c="dimmed">• Votre nom d'affichage</Text>
            <Text size="sm" c="dimmed">• Votre photo de profil</Text>
            <Text size="sm" c="dimmed">• Un identifiant unique (non l'adresse email)</Text>
          </Stack>
          <Text size="sm" c="dimmed">
            Ces données sont utilisées uniquement pour personnaliser votre expérience (affichage de votre avatar,
            sauvegarde de votre progression) et pour les fonctionnalités d'échange entre joueurs.
          </Text>
        </Stack>

        <Stack gap="md">
          <Title order={3}>3. Cookies et stockage local</Title>
          <Text size="sm" c="dimmed">
            Nous utilisons deux types de stockage :
          </Text>
          <Stack gap="xs" pl="md">
            <Text size="sm" c="dimmed">
              <strong>Cookies nécessaires :</strong> utilisés par Supabase pour maintenir votre session d'authentification.
              Indispensables au fonctionnement du site.
            </Text>
            <Text size="sm" c="dimmed">
              <strong>Stockage local (localStorage) :</strong> utilisé pour sauvegarder votre inventaire et votre progression
              localement sur votre appareil.
            </Text>
          </Stack>
          <Text size="sm" c="dimmed">
            Aucun cookie publicitaire ou de traçage tiers n'est utilisé.
          </Text>
        </Stack>

        <Stack gap="md">
          <Title order={3}>4. Hébergement et sous-traitants</Title>
          <Stack gap="xs" pl="md">
            <Text size="sm" c="dimmed">
              <strong>Vercel</strong> — hébergement du site (États-Unis, données soumises au Privacy Shield)
            </Text>
            <Text size="sm" c="dimmed">
              <strong>Supabase</strong> — base de données et authentification (Union Européenne)
            </Text>
          </Stack>
        </Stack>

        <Stack gap="md">
          <Title order={3}>5. Durée de conservation</Title>
          <Text size="sm" c="dimmed">
            Vos données de profil et de progression sont conservées tant que votre compte est actif.
            Vous pouvez demander la suppression de vos données à tout moment.
          </Text>
        </Stack>

        <Stack gap="md">
          <Title order={3}>6. Vos droits (RGPD)</Title>
          <Text size="sm" c="dimmed">
            Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :
          </Text>
          <Stack gap="xs" pl="md">
            <Text size="sm" c="dimmed">• Droit d'accès à vos données personnelles</Text>
            <Text size="sm" c="dimmed">• Droit de rectification</Text>
            <Text size="sm" c="dimmed">• Droit à l'effacement (« droit à l'oubli »)</Text>
            <Text size="sm" c="dimmed">• Droit à la limitation du traitement</Text>
            <Text size="sm" c="dimmed">• Droit à la portabilité des données</Text>
          </Stack>
          <Text size="sm" c="dimmed">
            Pour exercer ces droits, contactez-nous via GitHub.
          </Text>
        </Stack>

        <Stack gap="md">
          <Title order={3}>7. Modifications</Title>
          <Text size="sm" c="dimmed">
            Cette politique peut être mise à jour à tout moment. La date de dernière mise à jour est indiquée en haut de cette page.
          </Text>
        </Stack>
      </Stack>
    </Container>
  );
}
