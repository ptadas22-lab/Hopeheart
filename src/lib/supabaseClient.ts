import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize Supabase only if environment variables are provided
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

/**
 * Stage 1: Saves consent locally and caches the pending entry method before auth redirect.
 */
export function saveSafeRulesConsentLocal(entryMethod: 'guest' | 'google' | 'email') {
  const currentIsoTime = new Date().toISOString();
  
  // Local fallback keys
  localStorage.setItem('hopeheart_safe_rules_accepted', 'true');
  localStorage.setItem('hopeheart_safe_rules_accepted_at', currentIsoTime);
  
  // Caching pending method
  localStorage.setItem('hopeheart_pending_entry_method', entryMethod);
  
  console.log(`[Consent] Stage 1 (Local cache & pending method) saved for: ${entryMethod}`);
}

/**
 * Stage 2: Saves consent to Supabase backend using the authenticated user_id and clears pending method.
 * Bypasses silently on any backend errors to preserve flow.
 */
export async function saveSafeRulesConsentBackend(userId: string, entryMethod: 'guest' | 'google' | 'email') {
  if (!supabase) {
    console.warn('[Consent] Supabase not configured. Stage 2 backend save bypassed.');
    return;
  }
  
  const currentIsoTime = new Date().toISOString();
  try {
    const { error } = await supabase
      .from('safe_rule_consents')
      .insert({
        user_id: userId,
        accepted: true,
        accepted_at: currentIsoTime,
        consent_version: 'v1',
        entry_method: entryMethod
      });

    if (error) {
      console.warn('[Consent] Stage 2 Supabase insert failed (check safe_rule_consents table setup):', error.message);
    } else {
      console.log('[Consent] Stage 2 Backend consent saved securely to Supabase.');
    }
  } catch (err) {
    console.warn('[Consent] Stage 2 Backend insert encountered error:', err);
  } finally {
    localStorage.removeItem('hopeheart_pending_entry_method');
  }
}

/**
 * Wrapper helper: Executes local consent saving immediately, and tries backend if user is already authenticated.
 */
export async function saveSafeRulesConsent(entryMethod: 'guest' | 'google' | 'email') {
  saveSafeRulesConsentLocal(entryMethod);
  
  if (!supabase) return;
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (userId) {
      await saveSafeRulesConsentBackend(userId, entryMethod);
    }
  } catch (e) {
    console.warn('[Consent] Error in saveSafeRulesConsent wrapper:', e);
  }
}
