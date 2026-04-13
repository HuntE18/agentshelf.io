"use client";

import { Suspense } from "react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type SignInForm = z.infer<typeof signInSchema>;

function AgentShelfLogo() {
  return (
    <div className="flex items-center gap-2 justify-center mb-8">
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        aria-label="AgentShelf logo"
      >
        <rect width="32" height="32" rx="8" fill="#4F46E5" />
        <rect x="6" y="20" width="20" height="3" rx="1.5" fill="#14B8A6" />
        <rect x="6" y="14" width="14" height="2.5" rx="1.25" fill="white" opacity="0.8" />
        <rect x="6" y="9" width="10" height="2.5" rx="1.25" fill="white" opacity="0.5" />
        <rect x="22" y="9" width="4" height="11" rx="1" fill="white" opacity="0.3" />
      </svg>
      <span className="text-xl font-bold text-foreground tracking-tight">
        agentshelf<span className="text-primary">.io</span>
      </span>
    </div>
  );
}

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInForm) => {
    setLoading(true);
    setAuthError("");
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setAuthError("Invalid email or password. Please try again.");
    } else if (result?.ok) {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl });
  };

  const handleDemo = async (email: string) => {
    setDemoLoading(email);
    setAuthError("");
    const result = await signIn("credentials", {
      email,
      password: "__demo__",
      redirect: false,
    });
    setDemoLoading(null);
    if (result?.ok) {
      router.push(callbackUrl);
      router.refresh();
    } else {
      setAuthError("Demo login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-sm">
        <AgentShelfLogo />

        <div className="rounded-2xl border border-border bg-card p-7 shadow-sm">
          <h1 className="text-2xl font-bold text-foreground text-center mb-1">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-7">
            Sign in to your AgentShelf account
          </p>

          {authError && (
            <div className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {authError}
            </div>
          )}

          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-border bg-card hover:bg-secondary py-2.5 text-sm font-medium text-foreground transition-colors disabled:opacity-60 mb-5"
          >
            {googleLoading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs text-muted-foreground">
              <span className="bg-card px-3">or sign in with email</span>
            </div>
          </div>

          {/* Email/Password form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-foreground">
                  Password
                </label>
                <a
                  href="mailto:hello@agentshelf.io?subject=Password reset"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href={`/signup${callbackUrl !== "/" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
              className="text-primary font-medium hover:underline"
            >
              Sign up free
            </Link>
          </div>

          {/* Demo access */}
          <div className="mt-6 border-t border-border pt-5">
            <p className="text-xs text-center text-muted-foreground mb-3 font-medium uppercase tracking-wide">
              Demo Access
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleDemo("demo@agentshelf.io")}
                disabled={demoLoading !== null}
                className="rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-medium text-foreground hover:bg-muted disabled:opacity-60 transition-colors"
              >
                {demoLoading === "demo@agentshelf.io" ? (
                  <span className="flex items-center justify-center gap-1">
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
                    Loading...
                  </span>
                ) : (
                  "Demo User"
                )}
              </button>
              <button
                onClick={() => handleDemo("admin@agentshelf.io")}
                disabled={demoLoading !== null}
                className="rounded-lg border border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2 text-xs font-medium text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 disabled:opacity-60 transition-colors"
              >
                {demoLoading === "admin@agentshelf.io" ? (
                  <span className="flex items-center justify-center gap-1">
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                    Loading...
                  </span>
                ) : (
                  "Admin Demo"
                )}
              </button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="hover:text-primary underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="hover:text-primary underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <SignInContent />
    </Suspense>
  );
}
