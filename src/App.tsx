import { lazy, Suspense, useEffect } from 'react';
import { AppShell, Box } from '@mantine/core';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { BackToTop } from './components/BackToTop';
import { LoadingScreen } from './components/LoadingScreen';
import { supabase } from './lib/supabase';
import { HEADER_GRADIENT } from './lib/constants';
import { useBreedingStore } from './store/useBreedingStore';
import { useAuth } from './hooks/useAuth';
import { CookieBanner } from './components/CookieBanner';
import { Footer } from './components/Footer';
import { MessagesProvider } from './contexts/MessagesContext';

const Home = lazy(() => import('./pages/Home'));
const Dragodindes = lazy(() => import('./pages/Dragodindes'));
const Muldos = lazy(() => import('./pages/Muldos'));
const Volkornes = lazy(() => import('./pages/Volkornes'));
const Caracteristiques = lazy(() => import('./pages/Caracteristiques'));
const Guide = lazy(() => import('./pages/Guide'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const Echange = lazy(() => import('./pages/Echange'));
const PolitiqueConfidentialite = lazy(() => import('./pages/PolitiqueConfidentialite'));
const MentionsLegales = lazy(() => import('./pages/MentionsLegales'));
const Profile = lazy(() => import('./pages/Profile'));
const Calculateur = lazy(() => import('./pages/Calculateur'));
const PublicProfile = lazy(() => import('./pages/PublicProfile'));

export default function App() {
  const { loading: authLoading } = useAuth();
  const loadFromSupabase = useBreedingStore((s) => s.loadFromSupabase);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) loadFromSupabase(data.session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadFromSupabase(session.user.id);
        supabase.from('user_profiles').upsert({
          user_id: session.user.id,
          full_name: session.user.user_metadata?.full_name,
          avatar_url: session.user.user_metadata?.avatar_url,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });
      }
    });

    return () => subscription.unsubscribe();
  }, [loadFromSupabase]);

  if (authLoading) return <LoadingScreen />;

  return (
    <BrowserRouter>
      <MessagesProvider>
      <AppShell header={{ height: 60 }} bg="orange.1">
        <AppShell.Header
          style={{
            background: HEADER_GRADIENT,
            border: 'none',
            boxShadow: '0 4px 24px rgba(180, 83, 9, 0.45), inset 0 1px 0 rgba(253, 186, 116, 0.2)',
          }}
        >
          <Navigation />
        </AppShell.Header>

        <AppShell.Main style={{ display: 'flex', flexDirection: 'column' }}>
          <BackToTop />
          <CookieBanner />
          <Box style={{ flex: 1 }}>
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dragodindes" element={<Dragodindes />} />
                <Route path="/muldos" element={<Muldos />} />
                <Route path="/volkornes" element={<Volkornes />} />
                <Route path="/caracteristiques" element={<Caracteristiques />} />
                <Route path="/guide" element={<Guide />} />
                <Route path="/echange" element={<Echange />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/politique-de-confidentialite" element={<PolitiqueConfidentialite />} />
                <Route path="/mentions-legales" element={<MentionsLegales />} />
                <Route path="/calculateur" element={<Calculateur />} />
                <Route path="/profil" element={<Profile />} />
                <Route path="/:username" element={<PublicProfile />} />
              </Routes>
            </Suspense>
          </Box>
          <Footer />
        </AppShell.Main>
      </AppShell>
      </MessagesProvider>
    </BrowserRouter>
  );
}
