import { Container, Title, Text, Stack, Divider } from '@mantine/core';

export default function MentionsLegales() {
  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <Stack gap="xs">
          <Title order={1} c="dark">Mentions légales</Title>
          <Text c="dimmed" size="sm">Conformément à la loi n°2004-575 du 21 juin 2004 pour la Confiance dans l'Économie Numérique (LCEN)</Text>
        </Stack>

        <Divider />

        <Stack gap="md">
          <Title order={3}>1. Éditeur du site</Title>
          <Stack gap="xs">
            <Text size="sm" c="dimmed"><strong>Nom :</strong> Xalarian (personne physique)</Text>
            <Text size="sm" c="dimmed"><strong>GitHub :</strong> github.com/Xalarian-Dev</Text>
          </Stack>
        </Stack>

        <Stack gap="md">
          <Title order={3}>2. Hébergement</Title>
          <Stack gap="xs">
            <Text size="sm" c="dimmed"><strong>Hébergeur :</strong> Vercel Inc.</Text>
            <Text size="sm" c="dimmed"><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</Text>
            <Text size="sm" c="dimmed"><strong>Site :</strong> vercel.com</Text>
          </Stack>
        </Stack>

        <Stack gap="md">
          <Title order={3}>3. Propriété intellectuelle</Title>
          <Text size="sm" c="dimmed">
            Le contenu de ce site (textes, structure, code source) est protégé par le droit d'auteur.
            Toute reproduction sans autorisation est interdite.
          </Text>
          <Text size="sm" c="dimmed">
            Dofus, Dragodindes, Muldos, Volkornes et tous les éléments associés sont des marques déposées
            d'Ankama Games. Ce site est un projet communautaire non officiel et n'est pas affilié à Ankama Games.
          </Text>
        </Stack>

        <Stack gap="md">
          <Title order={3}>4. Responsabilité</Title>
          <Text size="sm" c="dimmed">
            Les informations présentes sur ce site sont fournies à titre indicatif.
            L'éditeur ne saurait être tenu responsable des erreurs ou omissions, ni de l'utilisation
            qui pourrait en être faite par les visiteurs.
          </Text>
        </Stack>

        <Stack gap="md">
          <Title order={3}>5. Données personnelles</Title>
          <Text size="sm" c="dimmed">
            Pour toute information sur la collecte et le traitement des données personnelles,
            consultez notre <a href="/politique-de-confidentialite" style={{ color: 'inherit' }}>Politique de confidentialité</a>.
          </Text>
        </Stack>
      </Stack>
    </Container>
  );
}
