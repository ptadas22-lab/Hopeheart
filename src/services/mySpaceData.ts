import { supabase } from '../lib/supabaseClient';

interface SaveResult {
  ok: boolean;
  savedTo: 'supabase' | 'local';
  error?: string;
}

interface BasePrivateRecord {
  user_id: string | null;
  guest_id: string | null;
  source: string;
  created_at: string;
}

export interface DiaryPayload {
  title: string;
  moodText: string;
  diaryText: string;
}

export interface MemoryPayload {
  memoryTitle: string;
  smallGoodMoment: string;
  memoryText: string;
  dateOrAge: string;
  people: string;
  place: string;
  feelingConnectedToMemory: string;
  whyMemoryMatters: string;
}

export interface RememberMePayload {
  strengths: string;
  interests: string;
  calmingThings: string;
  favouriteFood: string;
  favouriteMusic: string;
  favouriteComfortActivity: string;
  safePlace: string;
  survivalReminder: string;
}

/**
 * Supabase tables expected for My Space persistence:
 *
 * create table public.hopeheart_diary_entries (
 *   id uuid primary key default gen_random_uuid(),
 *   user_id uuid null references auth.users(id) on delete set null,
 *   guest_id text null,
 *   title text null,
 *   mood_text text null,
 *   diary_text text not null,
 *   source text not null default 'my_space_diary',
 *   created_at timestamptz not null default now()
 * );
 *
 * create table public.hopeheart_memories (
 *   id uuid primary key default gen_random_uuid(),
 *   user_id uuid null references auth.users(id) on delete set null,
 *   guest_id text null,
 *   memory_title text not null,
 *   small_good_moment text null,
 *   memory_text text not null,
 *   date_or_age text null,
 *   people text null,
 *   place text null,
 *   feeling_connected_to_memory text null,
 *   why_memory_matters text null,
 *   source text not null default 'my_space_memory',
 *   created_at timestamptz not null default now()
 * );
 *
 * create table public.hopeheart_remember_me (
 *   id uuid primary key default gen_random_uuid(),
 *   user_id uuid null references auth.users(id) on delete set null,
 *   guest_id text null,
 *   strengths text null,
 *   interests text null,
 *   calming_things text null,
 *   favourite_food text null,
 *   favourite_music text null,
 *   favourite_comfort_activity text null,
 *   safe_place text null,
 *   survival_reminder text null,
 *   source text not null default 'my_space_remember_me',
 *   created_at timestamptz not null default now(),
 *   updated_at timestamptz null
 * );
 *
 * TODO: Enable Row Level Security and add policies so private diary,
 * memories, and Remember Me data remain visible only to the owner/session.
 */

function getOrCreateMySpaceGuestId(): string {
  const existingGuestId =
    localStorage.getItem('hopeheart_guest_session_id') ||
    localStorage.getItem('hopeheart_home_guest_id') ||
    localStorage.getItem('hopeheart_my_space_guest_id');

  if (existingGuestId) {
    localStorage.setItem('hopeheart_my_space_guest_id', existingGuestId);
    return existingGuestId;
  }

  const newGuestId = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  localStorage.setItem('hopeheart_my_space_guest_id', newGuestId);
  return newGuestId;
}

async function getPrivateRecordBase(source: string): Promise<BasePrivateRecord> {
  const guestId = getOrCreateMySpaceGuestId();
  let userId: string | null = null;

  if (supabase) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      userId = session?.user?.id || null;
    } catch (err) {
      console.warn('[MySpace] Could not read Supabase session:', err);
    }
  }

  return {
    user_id: userId,
    guest_id: userId ? null : guestId,
    source,
    created_at: new Date().toISOString()
  };
}

function readLocalArray<T>(key: string): T[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalArray<T>(key: string, record: T) {
  const existingRecords = readLocalArray<T>(key);
  localStorage.setItem(key, JSON.stringify([record, ...existingRecords].slice(0, 100)));
}

async function insertWithFallback<T extends Record<string, unknown>>(tableName: string, fallbackKey: string, record: T): Promise<SaveResult> {
  writeLocalArray(fallbackKey, record);

  if (!supabase) {
    console.info(`[MySpace] Supabase not configured. Saved ${tableName} locally for MVP fallback.`);
    return { ok: true, savedTo: 'local' };
  }

  try {
    const { error } = await supabase
      .from(tableName)
      .insert(record);

    if (error) {
      console.warn(`[MySpace] Supabase insert failed for ${tableName}:`, error.message);
      return { ok: false, savedTo: 'local', error: error.message };
    }

    return { ok: true, savedTo: 'supabase' };
  } catch (err) {
    console.warn(`[MySpace] Supabase insert encountered an error for ${tableName}:`, err);
    return { ok: false, savedTo: 'local', error: 'Unexpected save error' };
  }
}

export async function saveDiaryEntry(payload: DiaryPayload): Promise<SaveResult> {
  const baseRecord = await getPrivateRecordBase('my_space_diary');
  const record = {
    ...baseRecord,
    title: payload.title,
    mood_text: payload.moodText,
    diary_text: payload.diaryText
  };

  return insertWithFallback('hopeheart_diary_entries', 'hopeheart_diary_entries', record);
}

export async function saveMemoryEntry(payload: MemoryPayload): Promise<SaveResult> {
  const baseRecord = await getPrivateRecordBase('my_space_memory');
  const record = {
    ...baseRecord,
    memory_title: payload.memoryTitle,
    small_good_moment: payload.smallGoodMoment,
    memory_text: payload.memoryText,
    date_or_age: payload.dateOrAge,
    people: payload.people,
    place: payload.place,
    feeling_connected_to_memory: payload.feelingConnectedToMemory,
    why_memory_matters: payload.whyMemoryMatters
  };

  return insertWithFallback('hopeheart_memories', 'hopeheart_memories', record);
}

export async function saveRememberMeDetails(payload: RememberMePayload): Promise<SaveResult> {
  const baseRecord = await getPrivateRecordBase('my_space_remember_me');
  const record = {
    ...baseRecord,
    strengths: payload.strengths,
    interests: payload.interests,
    calming_things: payload.calmingThings,
    favourite_food: payload.favouriteFood,
    favourite_music: payload.favouriteMusic,
    favourite_comfort_activity: payload.favouriteComfortActivity,
    safe_place: payload.safePlace,
    survival_reminder: payload.survivalReminder,
    updated_at: new Date().toISOString()
  };

  localStorage.setItem('hopeheart_remember_me', JSON.stringify(record));

  if (!supabase) {
    console.info('[MySpace] Supabase not configured. Saved Remember Me locally for MVP fallback.');
    return { ok: true, savedTo: 'local' };
  }

  try {
    const { error } = await supabase
      .from('hopeheart_remember_me')
      .insert(record);

    if (error) {
      console.warn('[MySpace] Supabase insert failed for hopeheart_remember_me:', error.message);
      return { ok: false, savedTo: 'local', error: error.message };
    }

    return { ok: true, savedTo: 'supabase' };
  } catch (err) {
    console.warn('[MySpace] Supabase insert encountered an error for hopeheart_remember_me:', err);
    return { ok: false, savedTo: 'local', error: 'Unexpected save error' };
  }
}
