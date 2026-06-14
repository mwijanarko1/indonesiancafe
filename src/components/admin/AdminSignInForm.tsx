"use client";

import { useClerk, useSignIn, useUser } from "@clerk/nextjs";
import { Eye, EyeOff } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { checkAdminAccessAction } from "@/lib/actions/admin-access";

function getClerkErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null) {
    if ("longMessage" in error && typeof error.longMessage === "string") {
      return error.longMessage;
    }
    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }
    if (
      "errors" in error &&
      Array.isArray((error as { errors: unknown }).errors)
    ) {
      const [firstError] = (error as { errors: { longMessage?: string; message?: string }[] }).errors;
      if (firstError?.longMessage) {
        return firstError.longMessage;
      }
      if (firstError?.message) {
        return firstError.message;
      }
    }
  }

  return "Unable to sign in. Check the username and password, then try again.";
}

type AdminSignInFormProps = {
  initialAccessError?: string | null;
};

export function AdminSignInForm({ initialAccessError = null }: AdminSignInFormProps) {
  const { signOut } = useClerk();
  const { signIn, fetchStatus } = useSignIn();
  const { isSignedIn } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(initialAccessError);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(false);

  useEffect(() => {
    setError(initialAccessError);
  }, [initialAccessError]);

  useEffect(() => {
    if (!isSignedIn || isRedirecting) {
      return;
    }

    let cancelled = false;

    async function verifyExistingSession() {
      setIsCheckingAccess(true);
      try {
        const access = await checkAdminAccessAction();
        if (cancelled) {
          return;
        }

        if (access.ok) {
          setError(null);
          return;
        }

        setError(access.message);
      } catch {
        if (!cancelled) {
          setError("Unable to verify admin access. Try again in a moment.");
        }
      } finally {
        if (!cancelled) {
          setIsCheckingAccess(false);
        }
      }
    }

    void verifyExistingSession();

    return () => {
      cancelled = true;
    };
  }, [isSignedIn, isRedirecting]);

  function goToDashboard() {
    setError(null);
    setIsRedirecting(true);
    window.location.assign("/admin");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setIsSubmitting(true);

    let shouldRedirect = false;

    try {
      const passwordResult = await signIn.password({
        identifier: username.trim(),
        password,
      });

      if (passwordResult.error) {
        setError(getClerkErrorMessage(passwordResult.error));
        return;
      }

      const finalizeResult = await signIn.finalize();
      if (finalizeResult.error) {
        setError(getClerkErrorMessage(finalizeResult.error));
        return;
      }

      shouldRedirect = true;
      setIsRedirecting(true);
      window.location.assign("/admin");
    } catch (caughtError) {
      setError(getClerkErrorMessage(caughtError));
    } finally {
      if (!shouldRedirect) {
        setIsSubmitting(false);
      }
    }
  }

  if (isSignedIn && !isRedirecting) {
    return (
      <div className="rounded-sm border border-brand-cream/20 bg-white/5 px-6 py-5 backdrop-blur-sm">
        <p className="font-[family-name:var(--font-label)] text-sm tracking-wide text-brand-cream/80">
          You are already signed in.
        </p>
        {error ? (
          <p className="mt-4 rounded-sm border border-brand-gold/40 bg-brand-gold/10 px-4 py-3 text-sm leading-relaxed text-brand-cream">
            {error}
          </p>
        ) : null}
        <button
          type="button"
          onClick={goToDashboard}
          disabled={isCheckingAccess || isRedirecting}
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-sm bg-brand-cream px-5 py-2.5 font-[family-name:var(--font-label)] text-xs font-bold uppercase tracking-[0.1em] text-brand-maroon transition hover:bg-brand-cream-page focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cream disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isCheckingAccess ? "Checking access..." : isRedirecting ? "Opening dashboard..." : "Go to Dashboard"}
        </button>
        <button
          type="button"
          onClick={() => void signOut({ redirectUrl: "/sign-in" })}
          className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-sm border border-brand-gold/60 px-5 py-2.5 font-[family-name:var(--font-label)] text-xs font-bold uppercase tracking-[0.1em] text-brand-cream transition hover:bg-brand-gold/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <div>
        <label
          htmlFor="admin-username"
          className="font-[family-name:var(--font-label)] text-xs font-bold uppercase tracking-[0.14em] text-brand-cream/80"
        >
          Username
        </label>
        <input
          id="admin-username"
          name="username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
          className="mt-2 min-h-12 w-full rounded-sm border border-brand-cream/25 bg-brand-cream px-4 py-3 text-sm font-semibold text-brand-maroon shadow-sm placeholder:text-brand-maroon/35 focus:border-brand-gold focus:bg-white focus:outline-none"
          placeholder="username"
        />
      </div>

      <div>
        <label
          htmlFor="admin-password"
          className="font-[family-name:var(--font-label)] text-xs font-bold uppercase tracking-[0.14em] text-brand-cream/80"
        >
          Password
        </label>
        <div className="relative mt-2">
          <input
            id="admin-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="min-h-12 w-full rounded-sm border border-brand-cream/25 bg-brand-cream py-3 pl-4 pr-12 text-sm font-semibold text-brand-maroon shadow-sm placeholder:text-brand-maroon/35 focus:border-brand-gold focus:bg-white focus:outline-none"
            placeholder="password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="absolute inset-y-0 right-0 inline-flex w-12 items-center justify-center rounded-r-sm text-brand-maroon/55 transition hover:text-brand-maroon focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-gold"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {error ? (
        <p className="rounded-sm border border-brand-gold/40 bg-brand-gold/10 px-4 py-3 text-sm leading-relaxed text-brand-cream">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={fetchStatus === "fetching" || isSubmitting || isRedirecting}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-sm bg-brand-cream px-6 py-3 font-[family-name:var(--font-label)] text-sm font-bold uppercase tracking-[0.1em] text-brand-maroon shadow-sm transition hover:bg-brand-cream-page disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
      >
        {isSubmitting || isRedirecting ? "Checking..." : "Access Admin"}
      </button>
    </form>
  );
}
