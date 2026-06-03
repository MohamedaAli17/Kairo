import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/env";
import type { Database } from "@/types/database";

export function createClient() {
  const env = getSupabaseEnv();
  if ("error" in env) {
    throw new Error(env.error);
  }

  return createBrowserClient<Database>(env.url, env.anonKey);
}
