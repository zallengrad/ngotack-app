import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // During build time or if env vars are missing, we don't crash immediately.
  // Instead, we create a proxy or a dummy object that throws when used,
  // or we just leave it undefined and handle it in the API routes.
  // However, for simplicity and to satisfy imports, we can export a client 
  // that might fail if used, but at least the file evaluates.
  
  console.warn('⚠️ Supabase environment variables are missing. Client not initialized.');
  
  // Optional: Create a dummy client that throws helpful errors
  supabase = {
    from: () => {
      throw new Error('Supabase client not initialized. Check environment variables.');
    }
  };
}

export default supabase;
