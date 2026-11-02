import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import './index.css';
import App from './App';
import { AuthProvider } from './hooks/useAuth';
import CalcAlertWatcher from './components/CalcAlertWatcher';

const theme = createTheme({
  primaryColor: 'orange',
  // Contraste : texte et boutons orange au moins 4,5 : 1 sur blanc (WCAG AA), en gardant l'orange du site.
  primaryShade: { light: 9, dark: 6 },
  colors: {
    orange: [
      '#fff4e6', '#ffe8cc', '#ffd8a8', '#ffc078', '#ffa94d',
      '#ff922b', '#fd7e14', '#f76707', '#e8590c', '#c2410c',
    ],
    brown: [
      '#fdf8f5', '#f5ece3', '#e8d5c0', '#d9bc9a', '#c9a175',
      '#b98550', '#a06b35', '#7c3d1f', '#5e2910', '#3e1a08',
    ],
  },
  fontFamily: '"Nunito", sans-serif',
  headings: {
    fontFamily: '"Nunito", sans-serif',
    fontWeight: '800',
  },
  defaultRadius: 'md',
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <Notifications position="bottom-right" />
      <CalcAlertWatcher />
      <AuthProvider>
        <App />
      </AuthProvider>
    </MantineProvider>
  </StrictMode>,
);
