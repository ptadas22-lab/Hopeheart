import { supabase } from '../lib/supabaseClient';

interface SaveExpertSessionRequestInput {
  topic: string;
  sessionType: string;
  preferredTime: string;
  note: string;
}

interface SaveExpertSessionRequestResult {
  ok: boolean;
  savedTo: 'supabase' | 'local';
  error?: string;
}

const EXPERT_SESSION_SOURCE = 'resources_screen';
const EXPERT_SESSION_STATUS = 'requested';
const EXPERT_SESSION_STORAGE_KEY = 'hopeheart_expert_session_requests';

/**
 * Supabase table expected for expert/support session requests:
 *
 * create table public.hopeheart_expert_session_requests (
 *   id uuid primary key default gen_random_uuid(),
 *   user_id uuid null references auth.users(id) on delete set null,
 *   guest_id text null,
 *   topic text not null,
 *   session_type text not null,
 *   preferred_time text not null,
 *   note text null,
 *   status text not null default 'requested',
 *   source text not null default 'resources_screen',
 *   created_at timestamptz not null default now()
 * );
 *
 * TODO: Enable Row Level Security and add insert/select policies so session
 * requests are private to the requester and support operations role.
 */

function getOrCreateExpertSessionGuestId(): string {
  const existingGuestId =
    localStorage.getItem('hopeheart_guest_session_id') ||
    localStorage.getItem('hopeheart_home_guest_id') ||
    localStorage.getItem('hopeheart_my_space_guest_id') ||
    localStorage.getItem('hopeheart_expert_session_guest_id');

  if (existingGuestId) {
    localStorage.setItem('hopeheart_expert_session_guest_id', existingGuestId);
    return existingGuestId;
  }

  const newGuestId = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  localStorage.setItem('hopeheart_expert_session_guest_id', newGuestId);
  return newGuestId;
}

function readLocalRequests(): Record<string, unknown>[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(EXPERT_SESSION_STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLocalRequest(record: Record<string, unknown>): boolean {
  try {
    const existingRequests = readLocalRequests();
    localStorage.setItem(EXPERT_SESSION_STORAGE_KEY, JSON.stringify([record, ...existingRequests].slice(0, 100)));
    return true;
  } catch (err) {
    console.warn('[ExpertSession] Local fallback save failed:', err);
    return false;
  }
}

export async function saveExpertSessionRequest({
  topic,
  sessionType,
  preferredTime,
  note
}: SaveExpertSessionRequestInput): Promise<SaveExpertSessionRequestResult> {
  const guestId = getOrCreateExpertSessionGuestId();
  let userId: string | null = null;

  if (supabase) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      userId = session?.user?.id || null;
    } catch (err) {
      console.warn('[ExpertSession] Could not read Supabase session:', err);
    }
  }

  const record = {
    user_id: userId,
    guest_id: userId ? null : guestId,
    topic,
    session_type: sessionType,
    preferred_time: preferredTime,
    note,
    status: EXPERT_SESSION_STATUS,
    source: EXPERT_SESSION_SOURCE,
    created_at: new Date().toISOString()
  };

  const localSaved = saveLocalRequest(record);

  if (!supabase) {
    return localSaved
      ? { ok: true, savedTo: 'local' }
      : { ok: false, savedTo: 'local', error: 'Local fallback failed' };
  }

  try {
    const { error } = await supabase
      .from('hopeheart_expert_session_requests')
      .insert(record);

    if (error) {
      console.warn('[ExpertSession] Supabase insert failed:', error.message);
      return localSaved
        ? { ok: true, savedTo: 'local', error: error.message }
        : { ok: false, savedTo: 'local', error: error.message };
    }

    return { ok: true, savedTo: 'supabase' };
  } catch (err) {
    console.warn('[ExpertSession] Supabase insert encountered an error:', err);
    return localSaved
      ? { ok: true, savedTo: 'local', error: 'Unexpected Supabase save error' }
      : { ok: false, savedTo: 'local', error: 'Unexpected save error' };
  }
}
