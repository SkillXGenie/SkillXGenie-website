import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a dummy client that throws informative errors
const createDummyClient = () => {
  const errorMessage = 'Supabase client not initialized: Missing environment variables. Please check your .env file contains VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.';
  
  return {
    auth: {
      getUser: () => Promise.reject(new Error(errorMessage)),
      getSession: () => Promise.reject(new Error(errorMessage)),
      signUp: () => Promise.reject(new Error(errorMessage)),
      signInWithPassword: () => Promise.reject(new Error(errorMessage)),
      signOut: () => Promise.reject(new Error(errorMessage)),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    from: () => ({
      select: () => Promise.reject(new Error(errorMessage)),
      insert: () => Promise.reject(new Error(errorMessage)),
      update: () => Promise.reject(new Error(errorMessage)),
      delete: () => Promise.reject(new Error(errorMessage))
    })
  };
};

// Check if environment variables are present
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'Present' : 'Missing');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Present' : 'Missing');
  console.error('Please ensure your .env file is in the project root and contains both variables.');
  
  // Export dummy client that provides clear error messages
  export const supabase = createDummyClient() as any;
} else {
  // Validate URL format
  try {
    new URL(supabaseUrl);
  } catch (error) {
    console.error(`Invalid Supabase URL format: ${supabaseUrl}`);
    export const supabase = createDummyClient() as any;
  }

  console.log('Supabase URL:', supabaseUrl);
  console.log('Supabase Key exists:', !!supabaseAnonKey);

  // Create real Supabase client
  export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    },
    global: {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  });
}