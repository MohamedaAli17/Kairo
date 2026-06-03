import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { SignUpForm } from "@/components/auth/signup-form";

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-canvas px-4 pb-16 pt-28 md:px-6">
      <Navbar />

      <section className="mx-auto max-w-5xl rounded-3xl border border-black/5 bg-white p-6 shadow-soft md:p-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-ink md:text-5xl">
            Start your Kairo simulation
          </h1>
          <p className="mt-3 text-muted">
            Create your account — profile, simulation state, and welcome notification are set up
            automatically.
          </p>
        </div>

        <SignUpForm />

        <p className="mt-6 text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-brand hover:underline">
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
}
