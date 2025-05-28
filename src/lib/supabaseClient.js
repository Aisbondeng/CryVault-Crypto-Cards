console.log("URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("KEY:", import.meta.env.VITE_SUPABASE_KEY);
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase credentials are missing in .env');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
