"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed.");
        return;
      }

      alert("Account created successfully! Please sign in.");
      router.push("/login");
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        "Cannot connect to the backend. Check that your backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-white">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl md:grid-cols-2">
        <section className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-8 sm:p-12">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

          <Link href="/" className="relative flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl font-black text-blue-600 shadow-lg">
              T
            </span>
            <span className="text-2xl font-bold tracking-tight">
              TaskFlow
            </span>
          </Link>

          <div className="relative my-12">
            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm">
              ✦ Your productivity workspace
            </span>

            <h1 className="mt-8 text-4xl font-extrabold leading-tight sm:text-5xl">
              Turn your plans
              <br />
              into progress.
            </h1>

            <p className="mt-5 max-w-md leading-7 text-blue-100">
              Bring your projects, tasks, and team together in one
              organized workspace. Create your account and get started.
            </p>
          </div>

          <p className="relative text-sm text-blue-100/80">
            © 2026 TaskFlow · Plan smarter. Achieve more.
          </p>
        </section>

        <section className="p-7 sm:p-12">
          <div className="mx-auto max-w-md">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              Get started for free
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Create your account
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Join TaskFlow and manage your work more efficiently.
            </p>

            <form onSubmit={handleRegister} className="mt-8 space-y-5">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-200">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={80}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-200">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-200">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    minLength={6}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 pr-20 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-400 hover:text-blue-300"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-slate-200">
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  minLength={6}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Enter your password again"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                />
              </div>

              {error && (
                <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-blue-900/30 transition hover:from-blue-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create account →"}
              </button>
            </form>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-700" />
              <span className="text-xs text-slate-500">OR</span>
              <div className="h-px flex-1 bg-slate-700" />
            </div>

            <button
              type="button"
              onClick={() =>
                setError(
                  "Google sign-in is not configured yet. Please register with your email for now."
                )
              }
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-700"
            >
              <span className="font-bold text-lg">G</span>
              Continue with Google
            </button>

            <p className="mt-7 text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-blue-400 hover:text-blue-300">
                Sign in
              </Link>
            </p>

            <p className="mt-6 text-center text-xs leading-5 text-slate-500">
              By creating an account, you agree to your organization's
              applicable terms and privacy policy.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}