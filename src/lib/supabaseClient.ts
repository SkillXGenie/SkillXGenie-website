import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock client for when Supabase is not configured
const createMockClient = () => {
  return {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signUp: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Authentication not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.' } }),
      signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Authentication not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.' } }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: (callback: any) => {
        // Call callback immediately with no user
        callback('SIGNED_OUT', null);
        return { 
          data: { 
            subscription: { 
              unsubscribe: () => {} 
            } 
          } 
        };
      },
      resetPasswordForEmail: () => Promise.resolve({ error: { message: 'Authentication not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.' } }),
      verifyOtp: () => Promise.resolve({ error: { message: 'Authentication not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.' } }),
      resend: () => Promise.resolve({ error: { message: 'Authentication not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.' } })
    },
    from: (table: string) => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: null, error: { message: 'Database not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.' } }),
      update: () => Promise.resolve({ data: null, error: { message: 'Database not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.' } }),
      delete: () => Promise.resolve({ data: null, error: { message: 'Database not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.' } }),
      single: () => Promise.resolve({ data: null, error: { message: 'Database not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.' } }),
      eq: function(column: string, value: any) { return this; },
      neq: function(column: string, value: any) { return this; },
      gt: function(column: string, value: any) { return this; },
      gte: function(column: string, value: any) { return this; },
      lt: function(column: string, value: any) { return this; },
      lte: function(column: string, value: any) { return this; },
      like: function(column: string, value: any) { return this; },
      ilike: function(column: string, value: any) { return this; },
      is: function(column: string, value: any) { return this; },
      in: function(column: string, values: any[]) { return this; },
      contains: function(column: string, value: any) { return this; },
      containedBy: function(column: string, value: any) { return this; },
      rangeGt: function(column: string, value: any) { return this; },
      rangeGte: function(column: string, value: any) { return this; },
      rangeLt: function(column: string, value: any) { return this; },
      rangeLte: function(column: string, value: any) { return this; },
      rangeAdjacent: function(column: string, value: any) { return this; },
      overlaps: function(column: string, value: any) { return this; },
      textSearch: function(column: string, query: string) { return this; },
      match: function(query: object) { return this; },
      not: function(column: string, operator: string, value: any) { return this; },
      or: function(filters: string) { return this; },
      filter: function(column: string, operator: string, value: any) { return this; },
      order: function(column: string, options?: any) { return this; },
      limit: function(count: number) { return this; },
      range: function(from: number, to: number) { return this; }
    })
  };
};

// Declare the supabase variable at module level
let supabase: any;

// Check if environment variables are present and valid
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not configured. Using mock client.');
  console.warn('To enable authentication and database features, add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file');
  
  supabase = createMockClient();
} else {
  try {
    // Validate URL format
    new URL(supabaseUrl);
    
    console.log('Supabase configured successfully');
    
    // Create real Supabase client
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    });
  } catch (error) {
    console.warn(`Invalid Supabase URL format: ${supabaseUrl}. Using mock client.`);
    supabase = createMockClient();
  }
}

// Export the supabase client
export { supabase };