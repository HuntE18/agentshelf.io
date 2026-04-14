"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

interface PricingCTAProps {
  tier: "featured" | "spotlight";
  label: string;
  className?: string;
}

export function PricingCTA({ tier, label, className }: PricingCTAProps) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className={`h-11 rounded-xl bg-secondary animate-pulse ${className}`} />
    );
  }

  if (!session) {
    return (
      <Link
        href={`/signin?callbackUrl=/pricing`}
        className={className}
      >
        Sign in to get started
      </Link>
    );
  }

  return (
    <Link
      href={`/promote?tier=${tier}`}
      className={className}
    >
      {label}
    </Link>
  );
}
