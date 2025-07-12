import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client
// Using direct values from project configuration
const supabaseUrl = 'https://ejiibpkygqtbsqmsgrsv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqaWlicGt5Z3F0YnNxbXNncnN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNzc0NTgsImV4cCI6MjA2Nzg1MzQ1OH0.vieuK2iKrFAhOK2nOl_Oyv5UEMwyiPMZ5ByEavqFTFU';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };