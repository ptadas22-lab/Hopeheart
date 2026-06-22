import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize Supabase only if environment variables are provided
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

/**
 * Saves Safe Space Rules Consent.
 * 1. Saves to localStorage fallback first.
 * 2. Attempts to save to Supabase backend if initialized and authenticated.
 * 3. Falls back silently if Supabase is unconfigured or if connection/insert fails.
 */
export async function saveSafeRulesConsent(entryMethod: 'guest' | 'google' | 'email') {
  const currentIsoTime = new Date().toISOString();

  // 1. Save to local storage first (Consent cache)
  localStorage.setItem('hopeheart_safe_rules_accepted', 'true');
  localStorage.setItem('hopeheart_safe_rules_accepted_at', currentIsoTime);

  console.log(`[Consent] Local fallback saved successfully for method: ${entryMethod}`);

  // 2. Check if Supabase client is configured
  if (!supabase) {
    console.warn('[Consent] Supabase is not configured (VITE_SUPABASE_URL/ANON_KEY are missing). Saved to local storage only.');
    return;
  }

  try {
    // Check if an authenticated user session already exists
    let { data: { session } } = await supabase.auth.getSession();
    let userId = session?.user?.id || null;

    // 3. Anonymous Guest Login logic (only if Supabase Anonymous Sign-Ins are enabled)
    if (!userId && entryMethod === 'guest') {
      try {
        const { data: anonData, error: anonError } = await supabase.auth.signInAnonymously();
        if (anonError) {
          console.warn('[Consent] Anonymous Guest auth failed or is not enabled:', anonError.message);
        } else if (anonData?.session) {
          session = anonData.session;
          userId = anonData.session.user.id;
          console.log('[Consent] Anonymous Guest login session created successfully.');
        }
      } catch (authErr) {
        console.warn('[Consent] Error signing in anonymously:', authErr);
      }
    }

    // 4. Save to database if user is authenticated
    if (userId) {
      const { error: dbError } = await supabase
        .from('safe_rule_consents')
        .insert({
          user_id: userId,
          accepted: true,
          accepted_at: currentIsoTime,
          consent_version: 'v1',
          entry_method: entryMethod
        });

      if (dbError) {
        console.warn('[Consent] Supabase insert failed (check if database table safe_rule_consents is configured):', dbError.message);
      } else {
        console.log('[Consent] Consent saved securely to Supabase safe_rule_consents.');
      }
    } else {
      console.warn('[Consent] No authenticated session available for backend saving. Saved to local storage fallback only.');
    }
  } catch (err) {
    // 5. Fail silently without blocking the emotional-support flow
    console.warn('[Consent] Supabase operation encountered an error:', err);
  }
}
