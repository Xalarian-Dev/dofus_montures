import { Button } from '@mantine/core';
import { LogIn } from 'lucide-react';
import { requestLogin } from '@/lib/loginRequest';

// Bouton « Se connecter » des cartes « Connexion requise » : ouvre la même fenêtre
// que le bouton « Connexion » de l'en-tête.
export function LoginButton({ onClick }: { onClick?: () => void }) {
  return (
    <Button
      color="orange"
      size="sm"
      radius="md"
      leftSection={<LogIn size={16} />}
      onClick={() => { onClick?.(); requestLogin(); }}
    >
      Se connecter
    </Button>
  );
}
