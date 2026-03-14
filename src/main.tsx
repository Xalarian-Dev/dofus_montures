import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import './index.css';
import App from './App';
import { AuthProvider } from './hooks/useAuth';

const theme = createTheme({
  primaryColor: 'orange',
  colors: {
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
      <AuthProvider>
        <App />
      </AuthProvider>
    </MantineProvider>
  </StrictMode>,
);
