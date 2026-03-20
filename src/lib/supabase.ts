import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      heartbeat_interval: 15,
    },
  },
});

// Clean up realtime connections on HMR to avoid orphaned WebSockets.
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    supabase.removeAllChannels();
  });
}
