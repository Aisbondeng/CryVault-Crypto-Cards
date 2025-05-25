
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fefxdwxgoiqxgricpxcz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlZnhkd3hnb2lxeGdyaWNweGN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2Njk1ODAsImV4cCI6MjA2MzI0NTU4MH0.gHf7OidZKZL2zTwy0vrxL8h0Q_zb2g_oKdOGxO3QsI8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
