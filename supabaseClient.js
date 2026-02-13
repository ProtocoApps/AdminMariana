import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm';

// ATENÇÃO: este painel é separado do app, mas usa o MESMO Supabase.
// Você pode trocar esses valores depois sem mexer no app.
export const SUPABASE_URL = 'https://bqiklofbfiatcdpenpyy.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxaWtsb2ZiZmlhdGNkcGVucHl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5NDgxOTcsImV4cCI6MjA4NDUyNDE5N30._dNpdz9UjPijmx0QumORBYRxvUHcErFtdQ4KiFkpm6s';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
