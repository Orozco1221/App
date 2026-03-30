// src/data/seedSupabase.ts
// Script one-time para poblar la BD con los datos de mockData.ts.
// Uso: en DevTools escribe  →  await window.__seedSupabase()
// Eliminar el import de este archivo en index.tsx después de ejecutarlo.

import { supabase } from '../lib/supabaseClient';
import { initialContent } from './mockData';

const CATEGORIES = ['cafeteria', 'pills', 'structural', 'externalCerts'] as const;

export async function seedSupabase(): Promise<void> {
  console.log('[seed] Iniciando seeding de academy_content…');

  // Primero limpiamos para evitar duplicados
  const { error: deleteError } = await supabase
    .from('academy_content')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // borra todo

  if (deleteError) {
    console.error('[seed] Error limpiando tabla:', deleteError.message);
    return;
  }

  const rows: object[] = [];

  for (const cat of CATEGORIES) {
    const items = initialContent[cat];
    for (const item of items) {
      rows.push({
        title:        item.title,
        description:  item.description,
        short_desc:   item.shortDesc,
        category:     cat,
        media_type:   item.mediaType ?? 'video',
        media_url:    item.mediaUrl  ?? '#',
        duration:     item.duration  ?? null,
        instructor:   item.instructor ?? null,
        views:        item.views     ?? null,
        level:        item.level     ?? null,
        provider:     item.provider  ?? null,
        link:         item.link      ?? null,
      });
    }
  }

  const { error: insertError } = await supabase
    .from('academy_content')
    .insert(rows);

  if (insertError) {
    console.error('[seed] Error insertando filas:', insertError.message);
  } else {
    console.log(`[seed] ✅ ${rows.length} filas insertadas en academy_content.`);
  }
}
