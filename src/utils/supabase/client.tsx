import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

let supabaseClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient(
      `https://${projectId}.supabase.co`,
      publicAnonKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
          storage: {
            getItem: (key) => {
              if (typeof window !== 'undefined') {
                return window.localStorage.getItem(key);
              }
              return null;
            },
            setItem: (key, value) => {
              if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, value);
              }
            },
            removeItem: (key) => {
              if (typeof window !== 'undefined') {
                window.localStorage.removeItem(key);
              }
            },
          },
        },
      }
    );
  }
  return supabaseClient;
}
