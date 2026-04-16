"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

const submitSchema = z.object({
  name: z.string().min(2, "Tool name must be at least 2 characters"),
  websiteUrl: z.string().url("Please enter a valid URL (include https://)"),
  tagline: z
    .string()
    .min(10, "Tagline must be at least 10 characters")
    .max(120, "Tagline must be under 120 characters"),
  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(2000, "Description must be under 2000 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  pricingModel: z.enum(["Free", "Freemium", "Paid", "Open Source"], {
    errorMap: () => ({ message: "Please select a pricing model" }),
  }),
  pricingDetails: z.string().max(200).optional(),
  logoUrl: z.string().url("Please enter a valid image URL").optional().or(z.literal("")),
});

type SubmitForm = z.infer<typeof submitSchema>;

type Category = { id: string; name: string; icon: string };

export default function SubmitPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SubmitForm>({
    resolver: zodResolver(submitSchema),
    defaultValues: {
      pricingModel: "Free",
      logoUrl: "",
      pricingDetails: "",
    },
  });

  const descriptionValue = watch("description") || "";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin?callbackUrl=/submit");
    }
  }, [status, router]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  const onSubmit = async (data: SubmitForm) => {
    setSubmitting(true);
    setServerError("");
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setServerError(json.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      setSuccess(true);
    } catch {
      setServerError("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!session) return null;

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-5">🎉</div>
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Submission received!
          </h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Your submission is under review. Our team will check it against our
            quality guidelines and approve it within 1-2 business days. We&apos;ll
            notify you by email once it&apos;s live on the shelf.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/dashboard"
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              View My Submissions
            </Link>
            <Link
              href="/browse"
              className="rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              Browse Tools
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Add to the Shelf
          </h1>
          <p className="text-muted-foreground">
            Submit your AI tool for review. All submissions are manually
            reviewed before going live.
          </p>
        </div>

        {/* Guidelines */}
        <div className="mb-8 rounded-xl border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-900/20 p-5">
          <h3 className="text-sm font-semibold text-teal-800 dark:text-teal-200 mb-2">
            Submission guidelines
          </h3>
          <ul className="space-y-1 text-sm text-teal-700 dark:text-teal-300">
            <li>✓ Must be an AI-powered tool or agent</li>
            <li>✓ Must have a working public website</li>
            <li>✓ Write an honest, accurate description</li>
            <li>✗ No affiliate links or spam submissions</li>
          </ul>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 rounded-2xl border border-border bg-card p-6"
        >
          {serverError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {serverError}
            </div>
          )}

          {/* Tool Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Tool Name <span className="text-destructive">*</span>
            </label>
            <input
              {...register("name")}
              placeholder="e.g. ChatGPT, Claude, Midjourney"
              className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Website URL */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Website URL <span className="text-destructive">*</span>
            </label>
            <input
              {...register("websiteUrl")}
              placeholder="https://example.com"
              type="url"
              className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {errors.websiteUrl && (
              <p className="mt-1 text-xs text-destructive">{errors.websiteUrl.message}</p>
            )}
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Tagline <span className="text-destructive">*</span>
            </label>
            <input
              {...register("tagline")}
              placeholder="One sentence that captures what this tool does"
              maxLength={120}
              className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {errors.tagline && (
              <p className="mt-1 text-xs text-destructive">{errors.tagline.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Description <span className="text-destructive">*</span>
            </label>
            <textarea
              {...register("description")}
              placeholder="Describe the tool in detail — features, use cases, who it's for, and what makes it unique..."
              rows={6}
              className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
            <p className="mt-1 text-xs text-muted-foreground text-right">
              {descriptionValue.length} / 2000
            </p>
            {errors.description && (
              <p className="mt-1 text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Category <span className="text-destructive">*</span>
            </label>
            <select
              {...register("categoryId")}
              className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select a category...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-xs text-destructive">{errors.categoryId.message}</p>
            )}
          </div>

          {/* Pricing Model */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Pricing Model <span className="text-destructive">*</span>
            </label>
            <select
              {...register("pricingModel")}
              className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="Free">Free</option>
              <option value="Freemium">Freemium</option>
              <option value="Paid">Paid</option>
              <option value="Open Source">Open Source</option>
            </select>
            {errors.pricingModel && (
              <p className="mt-1 text-xs text-destructive">{errors.pricingModel.message}</p>
            )}
          </div>

          {/* Pricing Details */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Pricing Details{" "}
              <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <input
              {...register("pricingDetails")}
              placeholder="e.g. Free up to 100 requests/day, $20/mo for Pro"
              className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Logo URL */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Logo URL{" "}
              <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <input
              {...register("logoUrl")}
              placeholder="https://example.com/logo.png"
              type="url"
              className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Direct link to a square image (PNG or SVG preferred, min 128×128px).{" "}
              <span className="text-amber-600 dark:text-amber-400">Note: We only accept direct URLs for logos and images. File uploads are not supported.</span>
            </p>
            {errors.logoUrl && (
              <p className="mt-1 text-xs text-destructive">{errors.logoUrl.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Submitting...
              </span>
            ) : (
              "Submit for Review"
            )}
          </button>

          <p className="text-center text-xs text-muted-foreground">
            By submitting, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
