"use server";

import { redirect } from "next/navigation";
import { getSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export type AuthResult = { error?: string; success?: string };

function isNextRedirect(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "digest" in err &&
    String((err as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
  );
}

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
}

function authConfigError(): AuthResult | null {
  const env = getSupabaseEnv();
  if ("error" in env) return { error: env.error };
  return null;
}

function mapAuthError(err: unknown): string {
  if (err instanceof Error) {
    if (err.message.includes("fetch failed") || err.message.includes("ENOTFOUND")) {
      return "Cannot reach Supabase. Check NEXT_PUBLIC_SUPABASE_URL in .env.local and restart the dev server.";
    }
    return err.message;
  }
  return "Something went wrong. Please try again.";
}

export async function signUp(formData: FormData): Promise<AuthResult> {
  const configErr = authConfigError();
  if (configErr) return configErr;

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();
  const username = String(formData.get("username") ?? "").trim();

  if (!email || !password) {
    return { error: "Email and password are required." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${siteUrl()}/auth/callback`,
        data: {
          full_name: fullName,
          username: username || undefined,
        },
      },
    });

    if (error) {
      return { error: error.message };
    }

    if (data.user && !data.session) {
      return {
        success:
          "Account created! Check your email to confirm, then log in. (Or disable email confirmation in Supabase for instant access.)",
      };
    }

    redirect("/dashboard");
  } catch (err) {
    if (isNextRedirect(err)) throw err;
    return { error: mapAuthError(err) };
  }
}

export async function signIn(formData: FormData): Promise<AuthResult> {
  const configErr = authConfigError();
  if (configErr) return configErr;

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "/dashboard");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      if (error.message.toLowerCase().includes("email not confirmed")) {
        return {
          error: "Confirm your email first, or turn off “Confirm email” under Supabase → Authentication → Providers → Email.",
        };
      }
      return { error: error.message };
    }

    redirect(redirectTo.startsWith("/") ? redirectTo : "/dashboard");
  } catch (err) {
    if (isNextRedirect(err)) throw err;
    return { error: mapAuthError(err) };
  }
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
