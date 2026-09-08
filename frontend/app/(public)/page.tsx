import React from 'react';
import FeaturedPost from '@/app/components/blog/FeaturedPost';
import PostCard from '@/app/components/blog/PostCard';
import Pagination from '@/app/components/blog/Pagination';
import Sidebar from '@/app/components/blog/Sidebar';
import AdBox from '@/app/components/blog/AdBox';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 3600; // ISR

export default async function HomePage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || '1', 10);
  const postsPerPage = 4; // 1 featured + 3 regular on page 1. Then 4 regular on page 2.
  const start = (currentPage - 1) * postsPerPage;
  const end = start + postsPerPage - 1;

  const supabase = await createClient();

  const { data: posts, count } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, featured_image, published_at, views, category:categories(name)', { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(start, end);

  const totalPages = Math.ceil((count || 0) / postsPerPage);

  const isFirstPage = currentPage === 1;
  const featuredPost = isFirstPage && posts && posts.length > 0 ? posts[0] : null;
  const regularPosts = isFirstPage && posts && posts.length > 1 ? posts.slice(1) : posts || [];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-black dark:text-white transition-colors duration-200">
      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16">
        {/* Main Content Area */}
        <div className="flex-1 min-w-0 w-full">
          <h2 className="text-[#4595ff] text-sm font-bold mb-3">Latest</h2>
          
          {featuredPost && <FeaturedPost post={featuredPost as any} />}

          <hr className="border-gray-200 dark:border-zinc-800 my-8" />

          {/* Ad 1 — Leaderboard between featured post and cards grid */}
          {isFirstPage && (
            <div className="w-full flex justify-center mb-8">
              <AdBox slot={1} size="leaderboard" className="w-full" />
            </div>
          )}

          {/* Regular Posts Grid: 1-col mobile, 2-col sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {regularPosts.map((post) => (
              <PostCard key={post.id} post={post as any} />
            ))}
            
            {(!posts || posts.length === 0) && (
              <div className="col-span-full text-gray-500 py-8">No articles found.</div>
            )}
          </div>

          {/* Ad 2 — Large rectangle below post grid */}
          <div className="w-full flex justify-center mt-8">
            <AdBox slot={2} size="largeRectangle" className="w-full" />
          </div>

          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
        
        <Sidebar />
      </main>
    </div>
  );
}