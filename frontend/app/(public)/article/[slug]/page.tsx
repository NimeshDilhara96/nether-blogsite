import React from 'react';
import { EyeIcon } from '@/app/components/Icons';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import ViewTracker from '@/app/components/blog/ViewTracker';
import AdBox from '@/app/components/blog/AdBox';
import Image from 'next/image';

export const revalidate = 3600; // ISR

const BASE_URL = 'https://netherx.mommentx.space';
const SITE_NAME = 'Nether X';

/**
 * Images are already 1200×630 JPEG (resized at upload time via Canvas)
 * so we can use the direct Supabase storage URL as the OG image.
 */

/** Truncate a string to maxLen, appending … if cut */
function truncate(str: string, maxLen: number): string {
  return str.length <= maxLen ? str : str.slice(0, maxLen - 1) + '…'
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from('posts')
    .select('title, excerpt, featured_image')
    .eq('slug', slug)
    .single();

  if (!post) {
    return { title: 'Not Found' };
  }

  const url = `${BASE_URL}/article/${slug}`;

  // Page title: template adds " | Nether X" (11 chars) → keep base ≤49 so total ≤60
  const pageTitle = truncate(post.title, 49);

  // OG/Twitter title: standalone, can use full 60 chars
  const ogTitle = truncate(post.title, 60);

  const rawDesc = post.excerpt || post.title;
  const suffix = ' — Read more on Nether X, your go-to blog for movies, games, technology and reviews.';

  // HTML <meta description>: 120–160 chars
  const metaDesc = truncate(rawDesc.length < 80 ? rawDesc + suffix : rawDesc, 160);

  // OG/Twitter description: ≤125 chars (mobile social previews truncate here)
  const ogDesc = truncate(rawDesc.length < 40 ? rawDesc + suffix : rawDesc, 125);

  // OG image: already 1200×630 from upload (no transform needed)
  const ogImage = post.featured_image ?? null;

  return {
    title: pageTitle,
    description: metaDesc,
    alternates: { canonical: url },
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      url,
      type: 'article',
      siteName: SITE_NAME,
      images: ogImage
        ? [{ url: ogImage, width: 1200, height: 630, alt: ogTitle }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDesc,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  
  // Also check if user is admin, because admins can view drafts
  const { data: { user } } = await supabase.auth.getUser();
  let isAdmin = false;
  if (user) {
    const { data: admin } = await supabase.from('admins').select('*').eq('user_id', user.id).single();
    isAdmin = !!admin;
  }

  const query = supabase
    .from('posts')
    .select('*, category:categories(name)')
    .eq('slug', slug);

  if (!isAdmin) {
    query.eq('status', 'published');
  }

  const { data: post } = await query.single();

  if (!post) {
    notFound();
  }

  const articleUrl = `${BASE_URL}/article/${slug}`;

  // JSON-LD Article structured data — enables Google rich results
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.title,
    url: articleUrl,
    image: post.featured_image
      ? {
          '@type': 'ImageObject',
          url: post.featured_image,
          width: 1200,
          height: 630,
        }
      : undefined,
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.updated_at ?? post.published_at ?? post.created_at,
    author: {
      '@type': 'Organization',
      name: 'Nether X',
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Nether X',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/Nether-X.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
  };

  // BreadcrumbList JSON-LD — shows "Home > Category > Title" in Google results
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      ...(post.category?.name
        ? [{ '@type': 'ListItem', position: 2, name: post.category.name, item: `${BASE_URL}/category/${slug}` }]
        : []),
      { '@type': 'ListItem', position: post.category?.name ? 3 : 2, name: post.title, item: articleUrl },
    ],
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-black dark:text-white transition-colors duration-200">
      {/* JSON-LD structured data for Google rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <ViewTracker slug={slug} />
      <main className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex flex-col">
        
        {/* Main Content Area */}
        <div className="w-full">
          
          {/* Article Cover Image */}
          {post.featured_image && (
            <div className="w-full rounded-2xl overflow-hidden bg-gray-200 dark:bg-zinc-900 mb-8 relative" style={{ aspectRatio: '16/9' }}>
              <Image
                src={post.featured_image}
                alt={post.title}
                fill
                sizes="(max-width: 640px) 95vw, (max-width: 1024px) 85vw, 768px"
                className="object-cover"
                quality={70}
                priority
              />
            </div>
          )}

          {/* Like Section (Static for now) */}
          <div className="flex items-center gap-4 mb-10 px-2 sm:px-6">
            <button className="flex items-center gap-2 border border-gray-300 dark:border-zinc-700 rounded-full px-4 py-1.5 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              Like 10
            </button>
            <span className="text-sm text-gray-500 font-medium hidden sm:inline">Enjoyed this story? Give it a like.</span>
          </div>

          {/* Content Container with curved top border */}
          <div className="border-t-[3px] border-[#4595ff] rounded-t-[32px] sm:rounded-t-[40px] pt-8 sm:pt-10 px-0 sm:px-4">
            
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-6">
              <span className="bg-[#4595ff] text-white px-3 py-1 rounded-[6px] tracking-widest font-extrabold uppercase text-[10px]">
                {post.category?.name || 'Uncategorized'}
              </span>
              <span>{post.published_at ? new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Draft'}</span>
              <span className="flex items-center gap-1.5">
                <EyeIcon /> {post.views || 0} views
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight tracking-tight text-black dark:text-white break-words">
              {post.title}
            </h1>

            {/* Author */}
            <p className="text-gray-500 text-sm font-medium mb-10">
              By <span className="text-[#4595ff] cursor-pointer hover:underline">Nether X</span>
            </p>

            {/* Ad 4 — Leaderboard before article content */}
            <div className="w-full flex justify-center mb-8">
              <AdBox slot={4} size="leaderboard" className="w-full" />
            </div>

            {/* Article Content */}
            <article 
              className="prose dark:prose-invert prose-base sm:prose-lg max-w-none w-full min-w-0 text-gray-800 dark:text-gray-300 font-medium leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />

            {/* Ad 5 — Large rectangle after article content */}
            <div className="w-full flex justify-center mt-10">
              <AdBox slot={5} size="largeRectangle" className="w-full" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
