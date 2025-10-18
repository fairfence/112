import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ahvshpeekjghncygkzws.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_srv30LParvM7wbxPTtsVBA_eklUl37E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);