export function getSupabaseEnv(): { url: string; anonKey: string } | { error: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) {
    return {
      error:
        "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, save the file, then restart npm run dev.",
    };
  }

  if (
    url.includes("your-project") ||
    url.includes("placeholder") ||
    anonKey === "your-anon-key" ||
    anonKey === "placeholder"
  ) {
    return {
      error:
        "Replace the placeholder values in .env.local with your real Supabase URL and anon key from Project Settings → API.",
    };
  }

  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith("supabase.co")) {
      return { error: "NEXT_PUBLIC_SUPABASE_URL should be your https://xxxx.supabase.co project URL." };
    }
  } catch {
    return { error: "NEXT_PUBLIC_SUPABASE_URL is not a valid URL." };
  }

  return { url, anonKey };
}
