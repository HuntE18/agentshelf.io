"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ListingLogoProps {
  name: string;
  websiteUrl?: string | null;
  size?: number; // px, default 56
  className?: string;
}

function extractDomain(url?: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function getInitials(name: string): string {
  return name
    .split(/[\s\-_]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

// Deterministic color from name
const COLORS = [
  ["#4F46E5", "#818CF8"], // indigo
  ["#0D9488", "#2DD4BF"], // teal
  ["#7C3AED", "#A78BFA"], // violet
  ["#0369A1", "#38BDF8"], // sky
  ["#B45309", "#FCD34D"], // amber
  ["#BE185D", "#F472B6"], // pink
  ["#15803D", "#4ADE80"], // green
  ["#C2410C", "#FB923C"], // orange
];

function getColorPair(name: string): [string, string] {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length] as [string, string];
}

export function ListingLogo({ name, websiteUrl, size = 56, className }: ListingLogoProps) {
  const domain = extractDomain(websiteUrl);
  const googleUrl = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : null;
  const ddgUrl = domain ? `https://icons.duckduckgo.com/ip3/${domain}.ico` : null;

  const [src, setSrc] = useState<string | null>(googleUrl);
  const [fallbackStage, setFallbackStage] = useState(0); // 0=google, 1=ddg, 2=initials

  const initials = getInitials(name);
  const [bg, text] = getColorPair(name);

  const handleError = () => {
    if (fallbackStage === 0 && ddgUrl) {
      setSrc(ddgUrl);
      setFallbackStage(1);
    } else {
      setSrc(null);
      setFallbackStage(2);
    }
  };

  const containerStyle: React.CSSProperties = {
    width: size,
    height: size,
    minWidth: size,
    borderRadius: Math.round(size * 0.214), // ~12px at 56px
  };

  if (!src || fallbackStage === 2) {
    return (
      <div
        className={cn("flex items-center justify-center font-bold select-none border border-white/10", className)}
        style={{
          ...containerStyle,
          background: `linear-gradient(135deg, ${bg}, ${text})`,
          color: "#fff",
          fontSize: size * 0.3,
          boxShadow: `0 2px 8px ${bg}40`,
        }}
        aria-label={name}
      >
        {initials}
      </div>
    );
  }

  return (
    <div
      className={cn("overflow-hidden bg-white dark:bg-slate-800 border border-border flex items-center justify-center", className)}
      style={containerStyle}
    >
      <Image
        src={src}
        alt={`${name} logo`}
        width={size}
        height={size}
        className="object-contain p-1"
        onError={handleError}
        unoptimized
      />
    </div>
  );
}
