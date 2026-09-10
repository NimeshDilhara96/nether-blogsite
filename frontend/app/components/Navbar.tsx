"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState<"EN" | "AR">("EN");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    setDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  const toggleDark = () => {
    setDarkMode((prev) => {
      const isDark = !prev;
      if (isDark) {
        document.documentElement.classList.add("dark");
        localStorage.theme = "dark";
        // Cookie එකේත් save කරනවා — server-side rendering සඳහා
        document.cookie = "theme=dark; path=/; max-age=31536000; SameSite=Lax";
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.theme = "light";
        document.cookie = "theme=light; path=/; max-age=31536000; SameSite=Lax";
      }
      return isDark;
    });
  };

  const toggleLang = () => setLang((prev) => (prev === "EN" ? "AR" : "EN"));

  const handleSearch = () => {
    const q = searchQuery.trim();
    if (!q) return;
    closeSearch();
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <>
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-[100] w-full bg-[#4595ff] font-sans"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-1 sm:gap-3">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0" aria-label="Nether X Home">
            <Image src="/N.png" alt="Nether X N icon" width={42} height={42}
              className="rounded object-contain w-7 h-7 sm:w-[42px] sm:h-[42px]" style={{ width: "auto" }} priority />
            <Image src="/Nether-X.png" alt="Nether X" width={130} height={28}
              className="w-auto object-contain h-[18px] sm:h-7" priority />
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden lg:flex items-center gap-1 list-none m-0 p-0">
            {[
              { label: "Home",       href: "/" },
              { label: "Categories", href: "/categories" },
              { label: "About",      href: "/about" },
            ].map(({ label, href }) => (
              <li key={label}>
                <Link href={href}
                  className="text-white/90 no-underline text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-white/20 hover:text-white transition-colors duration-150">
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right-side actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">

            {/* Search */}
            <button id="navbar-search-btn" aria-label="Open search"
              onClick={() => setSearchOpen(true)}
              className="bg-transparent border-none p-1 sm:p-2 cursor-pointer flex items-center justify-center hover:opacity-75 transition-opacity duration-150 scale-90 sm:scale-100">
              <SearchIcon />
            </button>

            {/* Language toggle */}
            <button id="navbar-lang-btn" aria-label={`Switch language, currently ${lang}`}
              onClick={toggleLang}
              className="bg-transparent border border-white rounded-full w-7 h-7 sm:w-[38px] sm:h-[38px] flex items-center justify-center cursor-pointer text-white text-[10px] sm:text-[13px] font-bold tracking-wide hover:bg-white/15 transition-colors duration-150 flex-shrink-0">
              {lang}
            </button>

            {/* Dark mode toggle */}
            <button id="navbar-darkmode-btn"
              aria-label={mounted && darkMode ? "Switch to light mode" : "Switch to dark mode"}
              onClick={toggleDark}
              className="bg-transparent border border-white rounded-full w-7 h-7 sm:w-[38px] sm:h-[38px] flex items-center justify-center cursor-pointer hover:bg-white/15 transition-colors duration-150 flex-shrink-0">
              <div className="scale-75 sm:scale-100 flex items-center justify-center">
                {mounted ? (darkMode ? <SunIcon /> : <MoonIcon />) : <div className="w-[17px] h-[17px]" />}
              </div>
            </button>

            {/* Subscribe */}
            <Link href="/about#newsletter"
              className="flex items-center bg-transparent border border-white text-white rounded-xl px-2.5 py-1 sm:px-[18px] sm:py-[7px] text-[11px] sm:text-[15px] font-bold cursor-pointer hover:bg-white hover:text-[#4595ff] transition-colors duration-150 flex-shrink-0 whitespace-nowrap">
              Subscribe
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Search overlay ──────────────────────────────────────── */}
      {searchOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[200] flex items-start justify-center pt-16 sm:pt-24 px-4"
          role="dialog" aria-modal="true" aria-label="Search"
          onClick={(e) => e.target === e.currentTarget && closeSearch()}
        >
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
            {/* Input row */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-zinc-800">
              <SearchIcon color="#9ca3af" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                aria-label="Search articles"
                id="navbar-search-input"
                className="flex-1 border-none outline-none text-base text-gray-900 dark:text-white bg-transparent placeholder:text-gray-400"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                  if (e.key === "Escape") closeSearch();
                }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} aria-label="Clear search"
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-lg leading-none">
                  ✕
                </button>
              )}
            </div>

            {/* Footer row */}
            <div className="flex items-center justify-between px-5 py-3">
              <span className="text-xs text-gray-400">
                Press <kbd className="bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-[11px] font-mono">Enter</kbd> to search
              </span>
              <div className="flex gap-2">
                <button onClick={closeSearch}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 px-3 py-1.5 rounded-lg transition-colors">
                  Cancel
                </button>
                <button onClick={handleSearch} disabled={!searchQuery.trim()}
                  className="text-sm font-bold text-white bg-[#4595ff] px-4 py-1.5 rounded-lg hover:bg-[#3480e0] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ── SVG icons ────────────────────────────────────────────────── */
function SearchIcon({ color = "#fff" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="22" y2="22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff"
      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff"
      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}
