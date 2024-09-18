import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://doabuygwmiikcxuleuiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvYWJ1eWd3bWlpa2N4dWxldWlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU0MTUzMTEsImV4cCI6MjA0MDk5MTMxMX0.BBL2eLpWi26D8OAmJaDHzCLfb9sgfnI56WRx3j7uw6I'; // Ensure this key is kept secure

export const supabase = createClient(supabaseUrl, supabaseKey);
