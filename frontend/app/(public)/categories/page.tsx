import React from 'react';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export const revalidate = 3600;

export const metadata = {
  title: 'Categories — Nether X',
  description: 'Browse all topics and categories on Nether X.',
};

export default async function CategoriesPage() {
  const supabase = await createClient();

  // Fetch all categories with post counts
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('name');

  // Fetch post counts per category
  const { data: counts } = await supabase
    .from('posts')
    .select('category_id')
    .eq('status', 'published');

  const countMap: Record<string, number> = {};
  counts?.forEach(({ category_id }) => {
    if (category_id) countMap[category_id] = (countMap[category_id] ?? 0) + 1;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-black dark:text-white transition-colors duration-200">
      <main className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-10 lg:py-14">

        {/* Header */}
        <div className="mb-10 border-t-[3px] border-[#4595ff] rounded-t-[32px] pt-10 px-0 sm:px-4">
          <span className="bg-[#4595ff] text-white px-3 py-1 rounded-[6px] tracking-widest font-extrabold uppercase text-[10px]">
            Browse
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-5 mb-2 leading-tight">
            All Categories
          </h1>
          <p className="text-gray-500 text-sm">
            {categories?.length ?? 0} topics to explore
          </p>
        </div>

        {/* Categories grid */}
        {(!categories || categories.length === 0) ? (
          <p className="text-gray-500 text-center py-12">No categories yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => {
              const postCount = countMap[cat.id] ?? 0;
              return (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="group flex flex-col gap-3 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 hover:border-[#4595ff] dark:hover:border-[#4595ff] transition-all duration-200 hover:shadow-md"
                >
                  {/* Category icon placeholder */}
                  <div className="w-10 h-10 rounded-xl bg-[#4595ff]/10 flex items-center justify-center">
                    <span className="text-[#4595ff] font-extrabold text-lg leading-none">
                      {cat.name.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <h2 className="font-extrabold text-base text-black dark:text-white group-hover:text-[#4595ff] transition-colors">
                      {cat.name}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      {postCount} article{postCount !== 1 ? 's' : ''}
                    </p>
                  </div>

                  <span className="text-[#4595ff] text-xs font-bold mt-auto group-hover:underline">
                    Browse →
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
