import React from 'react';
import { createClient } from '@/lib/supabase/server';
import PostCard from '@/app/components/blog/PostCard';
import Link from 'next/link';
import type { PostCardPost } from '@/app/components/blog/PostCard';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  return {
    title: q ? `Search: "${q}" — Nether X` : 'Search — Nether X',
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? '';

  const supabase = await createClient();

  let posts: PostCardPost[] = [];

  if (query) {
    // Full-text search across title and excerpt using Postgres ilike
    const { data } = await supabase
      .from('posts')
      .select('id, title, slug, excerpt, featured_image, published_at, views, category:categories(name)')
      .eq('status', 'published')
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
      .order('published_at', { ascending: false })
      .limit(24);

    posts = (data ?? []) as unknown as PostCardPost[];
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-black dark:text-white transition-colors duration-200">
      <main className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-10 lg:py-14">

        {/* Header */}
        <div className="mb-8">
          <p className="text-[#4595ff] text-sm font-bold mb-1 uppercase tracking-widest">Search</p>
          {query ? (
            <>
              <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight break-words">
                Results for <span className="text-[#4595ff]">&quot;{query}&quot;</span>
              </h1>
              <p className="text-gray-500 text-sm mt-2">
                {posts.length} article{posts.length !== 1 ? 's' : ''} found
              </p>
            </>
          ) : (
            <h1 className="text-2xl sm:text-3xl font-extrabold">Search Articles</h1>
          )}
        </div>

        {/* Search form (for direct navigation / re-search) */}
        <form action="/search" method="GET" className="mb-10">
          <div className="flex items-center gap-3 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 bg-gray-50 dark:bg-zinc-900 focus-within:border-[#4595ff] transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af"
              strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="22" y2="22" />
            </svg>
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search articles..."
              autoComplete="off"
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400"
            />
            <button type="submit"
              className="text-sm font-bold text-white bg-[#4595ff] px-4 py-1.5 rounded-lg hover:bg-[#3480e0] transition-colors whitespace-nowrap">
              Search
            </button>
          </div>
        </form>

        {/* Results */}
        {!query && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-semibold mb-2">Type something to search</p>
            <p className="text-sm">Search across all articles by title or excerpt.</p>
          </div>
        )}

        {query && posts.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-semibold mb-2">No results found</p>
            <p className="text-sm mb-6">Try different keywords or browse all articles.</p>
            <Link href="/" className="text-[#4595ff] font-bold text-sm hover:underline">
              ← Back to Home
            </Link>
          </div>
        )}

        {posts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
