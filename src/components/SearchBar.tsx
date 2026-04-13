"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/browse?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative flex items-center">
        <svg
          className="absolute left-4 h-5 w-5 text-slate-400 pointer-events-none"
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
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search AI tools, agents, and more..."
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
  );
}
