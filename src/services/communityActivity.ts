import { supabase } from '../lib/supabaseClient';

export type CommunityActivityCategory = 'chat' | 'exercise' | 'guidance';
export type CommunityActivityAction = 'opened' | 'saved';

export interface SaveCommunityActivityInput {
  category: CommunityActivityCategory;
  activityKey: string;
  activityTitle: string;
  action?: CommunityActivityAction;
}

interface CommunityActivityRecord {
  user_id: string | null;
  guest_id: string | null;
  category: CommunityActivityCategory;
  activity_key: string;
  activity_title: string;
  action: CommunityActivityAction;
  source: 'community_screen';
  created_at: string;
}

interface SaveCommunityActivityResult {
  ok: boolean;
  savedTo: 'supabase' | 'local';
  error?: string;
}

const COMMUNITY_ACTIVITY_SOURCE = 'community_screen';
const COMMUNITY_ACTIVITY_LOCAL_KEY = 'hopeheart_community_activity';

/**
 * Supabase table expected when backend is enabled:
 *
 * public.hopeheart_community_activity
 * - id uuid primary key default gen_random_uuid()
 * - user_id uuid null references auth.users(id) on delete set null
 * - guest_id text null
 * - category text not null
 * - activity_key text not null
 * - activity_title text not null
 * - action text not null default 'opened'
 * - source text not null default 'community_screen'
 * - created_at timestamptz not null default now()
 *
 * RLS should allow anon/authenticated inserts for community_screen activity,
 * while authenticated reads should be limited to the user's own rows.
 */

function getOrCreateGuestId(): string {
  const existingGuestId =
    localStorage.getItem('hopeheart_guest_session_id') ||
    localStorage.getItem('hopeheart_home_guest_id') ||
    localStorage.getItem('hopeheart_community_guest_id');

  if (existingGuestId) {
    localStorage.setItem('hopeheart_community_guest_id', existingGuestId);
    return existingGuestId;
  }

  const newGuestId = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  localStorage.setItem('hopeheart_community_guest_id', newGuestId);
  return newGuestId;
}

function saveCommunityActivityLocal(record: CommunityActivityRecord) {
  const existingRecords = JSON.parse(localStorage.getItem(COMMUNITY_ACTIVITY_LOCAL_KEY) || '[]');
  localStorage.setItem(COMMUNITY_ACTIVITY_LOCAL_KEY, JSON.stringify([record, ...existingRecords].slice(0, 75)));
}

export async function saveCommunityActivity({
  category,
  activityKey,
  activityTitle,
  action = 'opened'
}: SaveCommunityActivityInput): Promise<SaveCommunityActivityResult> {
  const createdAt = new Date().toISOString();
  const guestId = getOrCreateGuestId();
  let userId: string | null = null;

  if (supabase) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      userId = session?.user?.id || null;
    } catch (err) {
      console.warn('[CommunityActivity] Could not read Supabase session:', err);
    }
  }

  const record: CommunityActivityRecord = {
    user_id: userId,
    guest_id: userId ? null : guestId,
    category,
    activity_key: activityKey,
    activity_title: activityTitle,
    action,
    source: COMMUNITY_ACTIVITY_SOURCE,
    created_at: createdAt
  };

  if (!supabase) {
    saveCommunityActivityLocal(record);
    console.info('[CommunityActivity] Supabase not configured. Saved Community activity locally for MVP fallback.');
    return { ok: true, savedTo: 'local' };
  }

  try {
    const { error } = await supabase
      .from('hopeheart_community_activity')
      .insert(record);

    if (error) {
      saveCommunityActivityLocal(record);
      console.warn('[CommunityActivity] Supabase insert failed for hopeheart_community_activity:', error.message);
      return { ok: false, savedTo: 'local', error: error.message };
    }

    return { ok: true, savedTo: 'supabase' };
  } catch (err) {
    saveCommunityActivityLocal(record);
    console.warn('[CommunityActivity] Supabase insert encountered an error:', err);
    return { ok: false, savedTo: 'local', error: 'Unexpected save error' };
  }
}
