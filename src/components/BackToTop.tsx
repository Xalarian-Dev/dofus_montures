import { useEffect, useState } from 'react';
import { ActionIcon, Transition } from '@mantine/core';
import { ArrowUp } from 'lucide-react';

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Transition mounted={visible} transition="slide-up" duration={200}>
      {(styles) => (
        <ActionIcon
          style={{
            ...styles,
            position: 'fixed',
            bottom: 25,
            right: 25,
            zIndex: 200,
          }}
          size="lg"
          radius="xl"
          color="orange"
          variant="filled"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Retour en haut"
        >
          <ArrowUp size={18} />
        </ActionIcon>
      )}
    </Transition>
  );
}
