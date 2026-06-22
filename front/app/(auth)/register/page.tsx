"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await api.auth.register(form.username, form.password);
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Orbs */}
      <div className="orb-1 absolute top-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-700 opacity-30 blur-[100px] pointer-events-none" />
      <div className="orb-2 absolute bottom-[-15%] left-[-10%] w-[450px] h-[450px] rounded-full bg-purple-800 opacity-25 blur-[100px] pointer-events-none" />
      <div className="orb-3 absolute top-[30%] left-[20%] w-[200px] h-[200px] rounded-full bg-indigo-600 opacity-15 blur-[60px] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 mb-4 shadow-lg shadow-violet-900/50">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-violet-200 to-purple-400 bg-clip-text text-transparent">
            TodoFlow
          </h1>
          <p className="text-muted mt-2 text-sm tracking-wide">
            Create your account and get started
          </p>
        </div>

        {/* Card */}
        <div className="relative rounded-2xl p-px bg-gradient-to-b from-violet-500/40 via-violet-500/10 to-transparent shadow-2xl shadow-violet-950/60">
          <div className="bg-surface/80 backdrop-blur-xl rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-foreground/80 tracking-wide">
                  Username
                </label>
                <input
                  value={form.username}
                  onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                  placeholder="Choose a username"
                  required
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-muted text-sm focus:outline-none focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/20 transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-foreground/80 tracking-wide">
                  Password
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="Create a password"
                  required
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-muted text-sm focus:outline-none focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/20 transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-foreground/80 tracking-wide">
                  Confirm password
                </label>
                <input
                  type="password"
                  value={form.confirm}
                  onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
                  placeholder="Repeat your password"
                  required
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-muted text-sm focus:outline-none focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/20 transition-all"
                />
              </div>

              {error && (
                <p className="text-danger text-sm text-center bg-danger/10 border border-danger/20 rounded-xl py-2.5 px-4">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3 text-sm tracking-wide transition-all shadow-lg shadow-violet-900/50 hover:shadow-violet-700/50 hover:-translate-y-0.5 cursor-pointer"
              >
                {loading ? "Creating account…" : "Create account"}
              </button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-muted text-xs">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <p className="text-center text-muted text-sm">
              Already have an account?{" "}
              <a href="/login" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
