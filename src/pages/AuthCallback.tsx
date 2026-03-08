import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Center, Loader } from '@mantine/core';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(() => navigate('/'));
  }, [navigate]);

  return (
    <Center h="60vh">
      <Loader color="orange" />
    </Center>
  );
}
