import { createClient } from '@supabase/supabase-js';
import 'expo-sqlite/localStorage/install';

const supabaseUrl = "https://hgeeiagsozagtmzchann.supabase.co";
const supabasePublishableKey = "sb_publishable_wudcsxFIQosxd-no0JwNLw_AJtwc8JW";

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
