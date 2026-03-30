// src/api/academyApi.ts
// CRUD contra Supabase para la sección Academy.
import { supabase } from '../lib/supabaseClient';
import type { ContentItem } from '../data/mockData';

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface AcademyRow {
  id: string;
  title: string;
  description: string;
  short_desc: string;
  category: string;
  media_type: string;
  media_url: string;
  storage_path: string | null;
  duration: string | null;
  instructor: string | null;
  views: string | null;
  level: string | null;
  provider: string | null;
  link: string | null;
  created_at: string;
}

export interface AcademyContent {
  cafeteria:     ContentItem[];
  pills:         ContentItem[];
  structural:    ContentItem[];
  externalCerts: ContentItem[];
}

// ─── Helper: snake_case → camelCase ───────────────────────────────────────────

function mapRowToItem(row: AcademyRow): ContentItem {
  return {
    id:          row.id as unknown as number,   // UUID, compatible con el index [key: string]
    title:       row.title,
    description: row.description,
    shortDesc:   row.short_desc,
    mediaType:   row.media_type,
    mediaUrl:    row.media_url,
    storagePath: row.storage_path ?? undefined,
    duration:    row.duration    ?? undefined,
    instructor:  row.instructor  ?? undefined,
    views:       row.views       ?? undefined,
    level:       row.level       ?? undefined,
    provider:    row.provider    ?? undefined,
    link:        row.link        ?? undefined,
    createdAt:   row.created_at,
  };
}

// ─── fetchAcademyContent ───────────────────────────────────────────────────────
// Devuelve los items agrupados por categoría listos para mergear en el state.

export async function fetchAcademyContent(): Promise<AcademyContent> {
  const empty: AcademyContent = {
    cafeteria:     [],
    pills:         [],
    structural:    [],
    externalCerts: [],
  };

  const { data, error } = await supabase
    .from('academy_content')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[academyApi] fetchAcademyContent error:', error.message);
    return empty;
  }

  const rows = (data ?? []) as AcademyRow[];

  return rows.reduce<AcademyContent>((acc, row) => {
    const cat = row.category as keyof AcademyContent;
    if (acc[cat]) {
      acc[cat].push(mapRowToItem(row));
    }
    return acc;
  }, empty);
}

// ─── addAcademyItem ────────────────────────────────────────────────────────────
// Si hay fichero lo sube a Storage y usa la URL pública; luego inserta la fila.

export async function addAcademyItem(
  category: string,
  itemData: { title: string; description: string; mediaUrl: string; mediaType: string },
  file?: File | null,
): Promise<ContentItem | null> {

  let mediaUrl    = itemData.mediaUrl;
  let storagePath: string | null = null;

  // — Subida de fichero ————————————————————————————————————————————————————
  if (file) {
    const ts   = Date.now();
    const path = `${category}/${ts}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from('academy-files')
      .upload(path, file, { upsert: false });

    if (uploadError) {
      console.error('[academyApi] upload error:', uploadError.message);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('academy-files')
      .getPublicUrl(path);

    mediaUrl    = urlData.publicUrl;
    storagePath = path;
  }

  // — Inserción en BD ——————————————————————————————————————————————————————
  const { data, error } = await supabase
    .from('academy_content')
    .insert({
      title:        itemData.title,
      description:  itemData.description,
      short_desc:   itemData.description.substring(0, 60) + (itemData.description.length > 60 ? '...' : ''),
      category,
      media_type:   itemData.mediaType,
      media_url:    mediaUrl,
      storage_path: storagePath,
      duration:     'NUEVO',
      views:        '0',
    })
    .select()
    .single();

  if (error) {
    console.error('[academyApi] insert error:', error.message);
    return null;
  }

  return mapRowToItem(data as AcademyRow);
}
