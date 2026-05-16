import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://oivmamxpkjwrhwdnvmqh.supabase.co";
const supabaseAnonKey = "sb_publishable_MCo6H30JG9GZ3ZDlottL1Q_pfFfdpEV";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
