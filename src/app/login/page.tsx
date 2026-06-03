import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirectTo?: string; error?: string };
}) {
  return (
    <main className="min-h-screen bg-canvas px-4 pb-16 pt-28 md:px-6">
      <Navbar />

      <section className="mx-auto max-w-md rounded-3xl border border-black/5 bg-white p-6 shadow-soft md:p-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-ink md:text-5xl">Welcome back</h1>
          <p className="mt-3 text-muted">Log in to continue your Kairo simulation.</p>
        </div>

        {searchParams.error === "auth_callback_failed" ? (
          <p className="mb-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
            Sign-in link expired or invalid. Try logging in again.
          </p>
        ) : null}

        <LoginForm redirectTo={searchParams.redirectTo} />

        <p className="mt-6 text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-brand hover:underline">
            Sign up
          </Link>
        </p>
      </section>
    </main>
  );
}
