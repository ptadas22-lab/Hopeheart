import { supabase } from '../lib/supabaseClient';

export type HomeMoodValue = 'calm' | 'low' | 'anxious' | 'tired';

interface SaveHomeMoodCheckInInput {
  moodId: string;
  moodLabel: string;
}

interface SaveHomeMoodCheckInResult {
  ok: boolean;
  savedTo: 'supabase' | 'local';
  error?: string;
}

const HOME_CHECKIN_SOURCE = 'home_check_in';

/**
 * Supabase table needed when backend is enabled:
 *
 * create table public.hopeheart_checkins (
 *   id uuid primary key default gen_random_uuid(),
 *   user_id uuid null references auth.users(id) on delete set null,
 *   guest_id text null,
 *   mood text not null check (mood in ('calm', 'low', 'anxious', 'tired')),
 *   mood_label text not null,
 *   source text not null default 'home_check_in',
 *   created_at timestamptz not null default now()
 * );
 *
 * TODO: Enable Row Level Security and add insert/select policies appropriate for
 * authenticated users and anonymous/guest MVP usage before relying on this table
 * in production.
 */

function normalizeHomeMoodValue(moodId: string): HomeMoodValue {
  if (moodId === 'sad' || moodId === 'low') return 'low';
  if (moodId === 'anxious') return 'anxious';
  if (moodId === 'tired') return 'tired';
  return 'calm';
}

function getOrCreateGuestId(): string {
  const existingGuestId =
    localStorage.getItem('hopeheart_guest_session_id') ||
    localStorage.getItem('hopeheart_home_guest_id');

  if (existingGuestId) {
    localStorage.setItem('hopeheart_home_guest_id', existingGuestId);
    return existingGuestId;
  }

  const newGuestId = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  localStorage.setItem('hopeheart_home_guest_id', newGuestId);
  return newGuestId;
}

function saveHomeCheckInLocal(record: {
  user_id: string | null;
  guest_id: string | null;
  mood: HomeMoodValue;
  mood_label: string;
  source: typeof HOME_CHECKIN_SOURCE;
  created_at: string;
}) {
  const localKey = 'hopeheart_home_checkins';
  const existingRecords = JSON.parse(localStorage.getItem(localKey) || '[]');
  localStorage.setItem(localKey, JSON.stringify([record, ...existingRecords].slice(0, 50)));
}

export async function saveHomeMoodCheckIn({ moodId, moodLabel }: SaveHomeMoodCheckInInput): Promise<SaveHomeMoodCheckInResult> {
  const createdAt = new Date().toISOString();
  const mood = normalizeHomeMoodValue(moodId);
  const guestId = getOrCreateGuestId();
  let userId: string | null = null;

  if (supabase) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      userId = session?.user?.id || null;
    } catch (err) {
      console.warn('[HomeCheckIn] Could not read Supabase session:', err);
    }
  }

  const record = {
    user_id: userId,
    guest_id: userId ? null : guestId,
    mood,
    mood_label: moodLabel,
    source: HOME_CHECKIN_SOURCE,
    created_at: createdAt
  };

  saveHomeCheckInLocal(record);

  if (!supabase) {
    console.info('[HomeCheckIn] Supabase not configured. Saved Home check-in locally for MVP fallback.');
    return { ok: true, savedTo: 'local' };
  }

  try {
    const { error } = await supabase
      .from('hopeheart_checkins')
      .insert(record);

    if (error) {
      console.warn('[HomeCheckIn] Supabase insert failed for hopeheart_checkins:', error.message);
      return { ok: false, savedTo: 'local', error: error.message };
    }

    return { ok: true, savedTo: 'supabase' };
  } catch (err) {
    console.warn('[HomeCheckIn] Supabase insert encountered an error:', err);
    return { ok: false, savedTo: 'local', error: 'Unexpected save error' };
  }
}
