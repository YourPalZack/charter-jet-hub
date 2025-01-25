import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please connect to Supabase using the "Connect to Supabase" button.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'charter-jet-marketplace@0.1.0'
    }
  }
});

// Add a response interceptor to handle common errors
supabase.handleError = (error) => {
  if (error.message === 'Failed to fetch') {
    return new Error('Unable to connect to the database. Please check your internet connection and try again.');
  }
  if (error.message?.includes('JWT')) {
    return new Error('Your session has expired. Please sign in again.');
  }
  return error;
};