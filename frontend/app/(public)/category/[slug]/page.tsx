import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import PostCard from '@/app/components/blog/PostCard';
import Pagination from '@/app/components/blog/Pagination';
import Sidebar from '@/app/components/blog/Sidebar';
import Link from 'next/link';
import type { PostCardPost } from '@/app/components/blog/PostCard';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: category } = await supabase
    .from('categories')
    .select('name')
    .eq('slug', slug)
    .single();

  if (!category) return { title: 'Not Found' };

  const url = `https://netherx.mommentx.space/category/${slug}`;

  return {
    title: `${category.name} — Nether X`,
    description: `Browse all ${category.name} articles on Nether X — movies, games, tech, film reviews and more.`,
    alternates: { canonical: url },
    openGraph: {
      title: `${category.name} — Nether X`,
      description: `Browse all ${category.name} articles on Nether X.`,
      url,
      type: 'website',
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page } = await searchParams;
  const currentPage = parseInt(page || '1', 10);
  const postsPerPage = 9;
  const start = (currentPage - 1) * postsPerPage;
  const end = start + postsPerPage - 1;

  const supabase = await createClient();

  // Get the category
  const { data: category } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('slug', slug)
    .single();

  if (!category) notFound();

  // Get posts in this category
  const { data: posts, count } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, featured_image, published_at, views, category:categories(name)', { count: 'exact' })
    .eq('status', 'published')
    .eq('category_id', category.id)
    .order('published_at', { ascending: false })
    .range(start, end);

  const totalPages = Math.ceil((count || 0) / postsPerPage);

  const BASE_URL = 'https://netherx.mommentx.space';

  // BreadcrumbList JSON-LD — shows breadcrumbs in Google search results
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Categories', item: `${BASE_URL}/categories` },
      { '@type': 'ListItem', position: 3, name: category.name, item: `${BASE_URL}/category/${slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-black dark:text-white transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16">

        {/* Main content */}
        <div className="flex-1 min-w-0 w-full">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
            <Link href="/" className="hover:text-[#4595ff] transition-colors">Home</Link>
            <span>›</span>
            <Link href="/categories" className="hover:text-[#4595ff] transition-colors">Categories</Link>
            <span>›</span>
            <span className="text-[#4595ff] font-semibold">{category.name}</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <span className="bg-[#4595ff] text-white px-3 py-1 rounded-[6px] tracking-widest font-extrabold uppercase text-[10px]">
              {category.name}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-4 mb-1 leading-tight">
              {category.name}
            </h1>
            <p className="text-gray-500 text-sm">
              {count ?? 0} article{(count ?? 0) !== 1 ? 's' : ''} in this category
            </p>
          </div>

          {/* Posts grid */}
          {(!posts || posts.length === 0) ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg font-semibold mb-2">No articles yet</p>
              <p className="text-sm mb-6">Check back soon or browse other categories.</p>
              <Link href="/categories" className="text-[#4595ff] font-bold text-sm hover:underline">
                ← All Categories
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post as unknown as PostCardPost} />
                ))}
              </div>
              <Pagination currentPage={currentPage} totalPages={totalPages} />
            </>
          )}
        </div>

        <Sidebar />
      </main>
    </div>
  );
}
