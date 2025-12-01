import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gsbamahxsxxyhozqoykl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzYmFtYWh4c3h4eWhvenFveWtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MDAzMzUsImV4cCI6MjA4MDE3NjMzNX0.lPcrnPtPdHUDHOgbWP7UT_-T1QwoK9OzA_rAEPmY5n0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
