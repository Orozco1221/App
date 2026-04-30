// src/lib/supabaseClient.ts
// Instancia única del cliente Supabase — importar desde aquí en todos los módulos.
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Si faltan las variables de entorno en producción, la app sigue funcionando
// con mockData (degradación graceful) en lugar de crashear al inicializar.
if (!supabaseUrl || !supabaseKey) {
  console.error(
    '[supabaseClient] Variables de entorno de Supabase no configuradas. ' +
    'La app funcionará en modo offline con datos mock.'
  );
}

export const supabase = createClient(
  supabaseUrl  ?? 'https://placeholder.supabase.co',
  supabaseKey  ?? 'placeholder-key',
);
