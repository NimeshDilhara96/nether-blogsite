import React from 'react';
import { EyeIcon } from '../Icons';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import AdBox from './AdBox';
import Image from 'next/image';

export default async function Sidebar() {
  const supabase = await createClient();

  // Fetch recent posts as "popular"
  const { data: popularPosts } = await supabase
    .from('posts')
    .select('id, title, slug, featured_image, views')
    .eq('status', 'published')
    .order('views', { ascending: false })
    .limit(4);

  // Fetch categories for "Browse Topics"
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('name');

  return (
    <aside className="w-full max-w-lg md:max-w-xl lg:max-w-[320px] mx-auto lg:mx-0 flex-shrink-0">
      {/* Divider only shown on mobile before sidebar */}
      <hr className="border-gray-200 dark:border-zinc-800 my-10 block lg:hidden" />

      <div className="sticky top-24">
        <h2 className="text-[#4595ff] text-[13px] font-bold mb-5">Popular</h2>
    
        <div className="flex flex-col gap-5">
          {popularPosts?.map((post) => (
            <Link key={post.id} href={`/article/${post.slug}`} className="flex items-center gap-4 group">
              <div className="w-[70px] h-[70px] bg-[#d9d9d9] dark:bg-zinc-800 rounded-[10px] border border-gray-600 dark:border-transparent flex-shrink-0 group-hover:opacity-80 transition-opacity overflow-hidden relative">
                {post.featured_image && (
                  <Image
                    src={post.featured_image}
                    alt={post.title}
                    fill
                    sizes="70px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="font-semibold text-[15px] leading-tight group-hover:underline line-clamp-2">
                  {post.title}
                </h3>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-gray-400 mt-1">
                  <EyeIcon /> {post.views || 0} views
                </span>
              </div>
            </Link>
          ))}
          {(!popularPosts || popularPosts.length === 0) && (
            <div className="text-gray-500 text-sm">No popular posts yet.</div>
          )}
        </div>

        {/* Browse Topics */}
        <h2 className="text-[#4595ff] text-[13px] font-bold mt-12 mb-4">Browse Topics</h2>
        <div className="flex flex-wrap gap-2.5">
          {categories?.map((category) => (
            <Link key={category.id} href={`/category/${category.slug}`} className="px-3.5 py-1 text-[11px] font-semibold bg-[#d9d9d9] dark:bg-transparent dark:border dark:border-gray-600 rounded-full text-black dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center">
              {category.name}
            </Link>
          ))}
          {(!categories || categories.length === 0) && (
            <div className="text-gray-500 text-sm">No topics found.</div>
          )}
        </div>

        {/* NewsLetter */}
        <div className="mt-8 border border-[#4595ff] rounded-[14px] p-5 bg-[#f4f9ff] dark:bg-[#0c1a2e] flex flex-col">
          <span className="text-[#4595ff] font-bold text-[13px]">NewsLetter</span>
          <h3 className="font-bold text-[17px] mt-3.5 leading-tight tracking-wide">Stay In the Loop.</h3>
          <p className="text-gray-600 dark:text-gray-300 text-[13px] mt-1.5 mb-5 font-medium">
            weekly and yearlt tip...
          </p>
          <button className="self-end bg-[#1a1a1a] dark:bg-[#4595ff] text-white font-bold text-[13px] px-5 py-2 rounded-full hover:opacity-90 transition-opacity">
            Subscribe Free
          </button>
        </div>

        {/* Sidebar Ad 3 — 300×250 Medium Rectangle */}
        <div className="mt-8 flex justify-center">
          <AdBox slot={3} size="rectangle" />
        </div>
      </div>
    </aside>
  );
}
