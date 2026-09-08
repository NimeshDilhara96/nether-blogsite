import React from 'react';
import { EyeIcon } from '../Icons';
import Link from 'next/link';

const imgHoverStyle = `
  .featured-img { transition: transform 0.5s cubic-bezier(.25,.8,.25,1); }
  .featured-img:hover { transform: scale(1.04); }
`;

interface FeaturedPostProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    featured_image: string;
    published_at: string;
    views: number;
    category: { name: string } | null;
  }
}

export default function FeaturedPost({ post }: FeaturedPostProps) {
  if (!post) return null;
  
  return (
    <div className="mb-8">
      <style>{imgHoverStyle}</style>
      <Link href={`/article/${post.slug}`} className="block">
        <div className="w-full rounded-2xl overflow-hidden bg-gray-200 dark:bg-zinc-900 mb-4" style={{ aspectRatio: '16/9' }}>
          {post.featured_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.featured_image}
              alt={post.title}
              className="featured-img w-full h-full object-cover block"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">No Image</div>
          )}
        </div>
      </Link>
      
      <div className="flex items-center gap-3 text-[11px] font-semibold text-gray-400 mb-2">
        <span className="text-[#4595ff] font-bold">{post.category?.name || 'Uncategorized'}</span>
        <span>{post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Draft'}</span>
        <span className="flex items-center gap-1">
          <EyeIcon /> {post.views || 0} views
        </span>
      </div>
      
      <Link href={`/article/${post.slug}`}>
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 leading-tight underline decoration-[2px] underline-offset-4 dark:decoration-white decoration-black hover:text-[#4595ff] transition-colors break-words">
          {post.title}
        </h2>
      </Link>
      
      <p className="text-[13px] text-black dark:text-gray-300 mb-5 leading-relaxed font-medium">
        {post.excerpt}
      </p>
      
      <Link href={`/article/${post.slug}`} className="text-[#4595ff] font-bold text-[13px] hover:underline">
        Read Article
      </Link>
    </div>
  );
}
