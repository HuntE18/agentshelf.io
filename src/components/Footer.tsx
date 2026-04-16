"use client";

import * as React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// ─── Newsletter ───────────────────────────────────────────────────────────────

function NewsletterForm() {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubscribed(true);
      toast({
        title: "You're on the shelf! 🎉",
        description: "We'll send you the best new AI tools each week.",
        variant: "success",
      });
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (subscribed) {
    return (
      <p className="text-sm text-teal-400">
        ✓ You're subscribed! Check your inbox.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm">
      <Input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus-visible:ring-teal-500"
      />
      <Button
        type="submit"
        disabled={loading}
        className="bg-teal-500 hover:bg-teal-600 text-white flex-shrink-0"
      >
        {loading ? "..." : "Subscribe"}
      </Button>
    </form>
  );
}

// ─── Footer columns ───────────────────────────────────────────────────────────

const footerColumns = [
  {
    title: "Explore",
    links: [
      { label: "Browse the Shelf", href: "/browse" },
      { label: "Categories", href: "/browse#categories" },
      { label: "New on the Shelf", href: "/browse?sort=newest" },
      { label: "Top Shelf Picks", href: "/browse?sort=top_rated" },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "Tutorials", href: "/tutorials" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Pricing", href: "/pricing" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
];

// ─── Logo ─────────────────────────────────────────────────────────────────────

function FooterLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <svg
        className="h-8 w-8 text-indigo-400"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="2" y="24" width="28" height="3" rx="1.5" fill="currentColor" opacity="0.9" />
        <rect x="2" y="14" width="28" height="2" rx="1" fill="currentColor" opacity="0.6" />
        <rect x="4" y="16" width="4" height="8" rx="0.5" fill="#14B8A6" />
        <rect x="9" y="17" width="3" height="7" rx="0.5" fill="#F59E0B" />
        <rect x="13" y="15" width="5" height="9" rx="0.5" fill="#4F46E5" />
        <rect x="19" y="17" width="3" height="7" rx="0.5" fill="#14B8A6" opacity="0.7" />
        <rect x="23" y="16" width="5" height="8" rx="0.5" fill="#F59E0B" opacity="0.8" />
      </svg>
      <span className="font-bold text-lg tracking-tight text-white">
        agentshelf
        <span className="text-slate-500 font-normal">.io</span>
      </span>
    </div>
  );
}

// ─── Main Footer ──────────────────────────────────────────────────────────────

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="grid grid-cols-1 gap-12 py-16 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <FooterLogo />
            <p className="mt-4 text-sm text-slate-400 max-w-xs leading-relaxed">
              The curated shelf for AI tools. Discover, compare, and add the best
              AI agents and tools to your workflow.
            </p>
            <div className="mt-8">
              <p className="mb-3 text-sm font-semibold text-slate-200">
                Stay in the loop
              </p>
              <p className="mb-3 text-xs text-slate-400">
                New on the Shelf — weekly digest of the best AI tools.
              </p>
              <NewsletterForm />
            </div>
          </div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-white mb-4">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="bg-slate-800" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
          <p className="text-sm text-slate-500">
            © 2026 AgentShelf, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/terms"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/contact"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
