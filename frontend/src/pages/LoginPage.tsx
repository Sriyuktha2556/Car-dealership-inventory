import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ApiRequestError } from "../api/client";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Enter your email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Unable to log in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-accent-500">
            Ridgeline Motors
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-white">Sign in</h1>
        </div>

        <form onSubmit={handleSubmit} noValidate className="rounded-lg bg-white p-6 shadow-xl">
          <div className="mb-4">
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink-900">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-steel-200 px-3 py-2 text-sm text-ink-900 focus:border-accent-500 focus:outline-none"
              aria-invalid={Boolean(error)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-ink-900">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-steel-200 px-3 py-2 text-sm text-ink-900 focus:border-accent-500 focus:outline-none"
              aria-invalid={Boolean(error)}
            />
          </div>

          {error && (
            <p role="alert" className="mb-4 rounded-md bg-signal-red/10 px-3 py-2 text-sm text-signal-red">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-ink-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>

          <p className="mt-4 text-center text-sm text-steel-500">
            Need an account?{" "}
            <Link to="/register" className="font-medium text-accent-600 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
