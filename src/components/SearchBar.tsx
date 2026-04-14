"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const POPULAR_SEARCHES = [
  { label: "ChatGPT", query: "ChatGPT" },
  { label: "Image generation", query: "Image generation" },
  { label: "Code assistant", query: "Code assistant" },
  { label: "Open source LLM", query: "Open source LLM" },
  { label: "AI writing", query: "AI writing" },
  { label: "Video generation", query: "Video generation" },
  { label: "AI agents", query: "AI agents" },
  { label: "Productivity", query: "Productivity" },
];

type Suggestion = {
  name: string;
  slug: string;
  category: { name: string; icon: string } | null;
};

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setSuggestions(data);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setActiveIdx(-1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.length >= 2) {
      debounceRef.current = setTimeout(() => fetchSuggestions(val), 300);
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
    if (query.trim()) {
      router.push(`/browse?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = query.length >= 2 ? suggestions : POPULAR_SEARCHES;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    } else if (e.key === "Enter" && activeIdx >= 0 && query.length >= 2) {
      e.preventDefault();
      const s = suggestions[activeIdx];
      if (s) {
        setOpen(false);
        router.push(`/listing/${s.slug}`);
      }
    }
  };

  const showPopular = open && query.length < 2;
  const showSuggestions = open && query.length >= 2;

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative flex items-center">
          <svg
            className="absolute left-4 h-5 w-5 text-slate-400 pointer-events-none z-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search AI tools, agents, and more..."
            autoComplete="off"
            className="w-full rounded-2xl border border-white/20 bg-white/10 py-4 pl-12 pr-36 text-white placeholder:text-slate-400 text-base backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
          />
          <button
            type="submit"
            className="absolute right-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition-all"
          >
            Search
          </button>
        </div>
      </form>

      {/* Dropdown */}
      {(showPopular || showSuggestions) && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl border border-border bg-popover shadow-lg overflow-hidden"
          style={{ maxHeight: "360px", overflowY: "auto" }}
        >
          {showPopular && (
            <>
              <div className="px-4 py-2.5 border-b border-border">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Popular searches</p>
              </div>
              <ul>
                {POPULAR_SEARCHES.map((item, idx) => (
                  <li key={item.query}>
                    <button
                      type="button"
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-secondary ${activeIdx === idx ? "bg-secondary" : ""}`}
                      onMouseDown={() => {
                        setOpen(false);
                        router.push(`/browse?q=${encodeURIComponent(item.query)}`);
                      }}
                    >
                      <svg className="h-4 w-4 text-muted-foreground shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span className="text-foreground">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {showSuggestions && (
            <>
              {loading ? (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  Searching...
                </div>
              ) : suggestions.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No results for &ldquo;{query}&rdquo;
                </div>
              ) : (
                <>
                  <div className="px-4 py-2.5 border-b border-border">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tools</p>
                  </div>
                  <ul>
                    {suggestions.map((s, idx) => (
                      <li key={s.slug}>
                        <Link
                          href={`/listing/${s.slug}`}
                          onMouseDown={() => setOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-secondary ${activeIdx === idx ? "bg-secondary" : ""}`}
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-base font-bold text-primary">
                            {s.name[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{s.name}</p>
                            {s.category && (
                              <p className="text-xs text-muted-foreground truncate">
                                {s.category.name}
                              </p>
                            )}
                          </div>
                          <svg className="h-4 w-4 text-muted-foreground shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-border">
                    <button
                      type="button"
                      onMouseDown={() => {
                        setOpen(false);
                        router.push(`/browse?q=${encodeURIComponent(query)}`);
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-primary hover:bg-secondary transition-colors font-medium"
                    >
                      See all results for &ldquo;{query}&rdquo; →
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
