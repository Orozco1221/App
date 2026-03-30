// src/lib/supabaseClient.ts
// Instancia única del cliente Supabase — importar desde aquí en todos los módulos.
import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = process.env.REACT_APP_SUPABASE_URL!;
const supabaseKey  = process.env.REACT_APP_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
