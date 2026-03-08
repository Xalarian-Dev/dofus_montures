import { useEffect } from 'react';
import { AppShell } from '@mantine/core';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { BackToTop } from './components/BackToTop';
import Home from './pages/Home';
import Dragodindes from './pages/Dragodindes';
import Muldos from './pages/Muldos';
import Volkornes from './pages/Volkornes';
import Caracteristiques from './pages/Caracteristiques';
import Guide from './pages/Guide';
import AuthCallback from './pages/AuthCallback';
import Echange from './pages/Echange';
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite';
import MentionsLegales from './pages/MentionsLegales';
import Profile from './pages/Profile';
import PublicProfile from './pages/PublicProfile';
import { supabase } from './lib/supabase';
import { useBreedingStore } from './store/useBreedingStore';
import { CookieBanner } from './components/CookieBanner';
import { Footer } from './components/Footer';

export default function App() {
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

  return (
    <BrowserRouter>
      <AppShell header={{ height: 60 }} bg="orange.0">
        <AppShell.Header
          style={{
            background: 'linear-gradient(90deg, #7c2d12, #92400e)',
            border: 'none',
          }}
        >
          <Navigation />
        </AppShell.Header>

        <AppShell.Main>
          <BackToTop />
          <CookieBanner />
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
            <Route path="/profil" element={<Profile />} />
            <Route path="/:username" element={<PublicProfile />} />
          </Routes>
          <Footer />
        </AppShell.Main>
      </AppShell>
    </BrowserRouter>
  );
}
