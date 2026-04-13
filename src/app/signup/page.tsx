"use client";

import { Suspense } from "react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

const signUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
      .regex(/[0-9]/, "Password must contain at least 1 number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpForm = z.infer<typeof signUpSchema>;

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

type PasswordStrength = {
  score: number;
  label: string;
  color: string;
};

function getPasswordStrength(password: string): PasswordStrength {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (password.length >= 12) score++;

  const levels: PasswordStrength[] = [
    { score: 0, label: "", color: "" },
    { score: 1, label: "Very weak", color: "bg-red-500" },
    { score: 2, label: "Weak", color: "bg-orange-500" },
    { score: 3, label: "Fair", color: "bg-amber-500" },
    { score: 4, label: "Good", color: "bg-teal-500" },
    { score: 5, label: "Strong", color: "bg-green-500" },
  ];

  return levels[Math.min(score, 5)];
}

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
  });

  const passwordValue = watch("password") || "";
  const strength = getPasswordStrength(passwordValue);

  const onSubmit = async (data: SignUpForm) => {
    setLoading(true);
    setServerError("");
    try {
      // Create account
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setServerError(json.error || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      // Auto sign in
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      setLoading(false);

      if (signInResult?.ok) {
        router.push(callbackUrl);
        router.refresh();
      } else {
        // Account was created but auto-login failed — redirect to sign in
        router.push(`/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      }
    } catch {
      setServerError("Network error. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-sm">
        <AgentShelfLogo />

        <div className="rounded-2xl border border-border bg-card p-7 shadow-sm">
          <h1 className="text-2xl font-bold text-foreground text-center mb-1">
            Create your account
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-7">
            Free forever. No credit card required.
          </p>

          {serverError && (
            <div className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {serverError}
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
              <span className="bg-card px-3">or create with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Full Name
              </label>
              <input
                {...register("name")}
                placeholder="Your name"
                autoComplete="name"
                className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
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

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {/* Strength indicator */}
              {passwordValue.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength.score ? strength.color : "bg-border"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {strength.label && (
                      <span>
                        Strength:{" "}
                        <span
                          className={
                            strength.score <= 2
                              ? "text-red-500"
                              : strength.score === 3
                                ? "text-amber-500"
                                : "text-green-500"
                          }
                        >
                          {strength.label}
                        </span>
                      </span>
                    )}
                  </p>
                  <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                    <li className={passwordValue.length >= 8 ? "text-green-600 dark:text-green-400" : ""}>
                      {passwordValue.length >= 8 ? "✓" : "·"} At least 8 characters
                    </li>
                    <li className={/[A-Z]/.test(passwordValue) ? "text-green-600 dark:text-green-400" : ""}>
                      {/[A-Z]/.test(passwordValue) ? "✓" : "·"} 1 uppercase letter
                    </li>
                    <li className={/[0-9]/.test(passwordValue) ? "text-green-600 dark:text-green-400" : ""}>
                      {/[0-9]/.test(passwordValue) ? "✓" : "·"} 1 number
                    </li>
                  </ul>
                </div>
              )}
              {errors.password && (
                <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Confirm Password
              </label>
              <input
                {...register("confirmPassword")}
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.confirmPassword.message}
                </p>
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
                  Creating account...
                </span>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href={`/signin${callbackUrl !== "/" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By creating an account, you agree to our{" "}
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

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <SignUpContent />
    </Suspense>
  );
}
