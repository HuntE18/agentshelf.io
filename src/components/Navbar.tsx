"use client";

import * as React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { Menu, Sun, Moon, X, ChevronDown, LayoutDashboard, Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// ─── Logo ─────────────────────────────────────────────────────────────────────

function ShelfLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="AgentShelf logo"
    >
      {/* Shelf boards */}
      <rect x="2" y="24" width="28" height="3" rx="1.5" fill="currentColor" opacity="0.9" />
      <rect x="2" y="14" width="28" height="2" rx="1" fill="currentColor" opacity="0.6" />
      {/* Books */}
      <rect x="4" y="16" width="4" height="8" rx="0.5" fill="#14B8A6" />
      <rect x="9" y="17" width="3" height="7" rx="0.5" fill="#F59E0B" />
      <rect x="13" y="15" width="5" height="9" rx="0.5" fill="#4F46E5" />
      <rect x="19" y="17" width="3" height="7" rx="0.5" fill="#14B8A6" opacity="0.7" />
      <rect x="23" y="16" width="5" height="8" rx="0.5" fill="#F59E0B" opacity="0.8" />
    </svg>
  );
}

// ─── Nav links ────────────────────────────────────────────────────────────────

const navLinks = [
  { label: "Browse the Shelf", href: "/browse" },
  { label: "Learn", href: "/tutorials" },
  { label: "Pricing", href: "/pricing" },
];

// ─── User dropdown ────────────────────────────────────────────────────────────

function UserMenu({ user }: { user: { name?: string | null; email?: string | null; image?: string | null; role?: string } }) {
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const initials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? user.email?.[0]?.toUpperCase() ?? "U";

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-slate-500 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-border bg-white shadow-lg dark:bg-slate-900">
          <div className="px-3 py-2.5">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
              {user.name ?? "User"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {user.email}
            </p>
          </div>
          <Separator />
          <div className="p-1">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            {user.role === "ADMIN" && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            )}
          </div>
          <Separator />
          <div className="p-1">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Dark mode toggle ─────────────────────────────────────────────────────────

function DarkModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-10 w-10" />;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle dark mode"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────

export function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white/80 backdrop-blur-md dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 flex-shrink-0"
          aria-label="AgentShelf home"
        >
          <ShelfLogo className="h-8 w-8 text-indigo-600" />
          <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
            agentshelf
            <span className="text-slate-400 dark:text-slate-500 font-normal">
              .io
            </span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-1 ml-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right side */}
        <div className="flex items-center gap-2">
          <DarkModeToggle />

          {session?.user ? (
            <UserMenu user={session.user as any} />
          ) : (
            <>
              <Button variant="ghost" asChild className="hidden sm:inline-flex">
                <Link href="/signin">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign up free</Link>
              </Button>
            </>
          )}

          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-white dark:bg-slate-950 md:hidden">
          <nav className="space-y-1 px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Separator className="my-2" />
            {!session?.user && (
              <div className="flex flex-col gap-2 pt-1">
                <Button variant="outline" asChild className="w-full">
                  <Link href="/signin" onClick={() => setMobileOpen(false)}>
                    Sign in
                  </Link>
                </Button>
                <Button asChild className="w-full">
                  <Link href="/signup" onClick={() => setMobileOpen(false)}>
                    Sign up free
                  </Link>
                </Button>
              </div>
            )}
            {session?.user && (
              <div className="space-y-1 pt-1">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                {(session.user as any).role === "ADMIN" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Shield className="h-4 w-4" />
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
