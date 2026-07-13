import { createClient } from "@supabase/supabase-js";

// Load environment variables.
// In Next.js App Router, environment variables prefixed with NEXT_PUBLIC_ 
// are automatically injected into the JavaScript bundle sent to the browser,
// making them safe to read in client-side components.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase credentials missing. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in web/.env.local"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
