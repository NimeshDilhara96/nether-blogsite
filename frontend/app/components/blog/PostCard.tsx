import React from 'react';
import { EyeIcon } from '../Icons';
import Link from 'next/link';
import Image from 'next/image';

export interface PostCardPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featured_image: string;
  published_at: string;
  views: number;
  category: { name: string } | null;
}

interface PostCardProps {
  post: PostCardPost;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className="border border-gray-200 dark:border-zinc-800 rounded-2xl p-2.5 flex flex-col h-full">
      <Link href={`/article/${post.slug}`} className="block">
        <div className="w-full rounded-xl overflow-hidden bg-gray-200 dark:bg-zinc-900 mb-3 relative" style={{ aspectRatio: '4/3' }}>
          {post.featured_image ? (
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 280px"
              className="object-cover transition-transform duration-500 hover:scale-105"
              quality={60}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">No Image</div>
          )}
        </div>
      </Link>
      
      <div className="px-1 flex flex-col flex-1">
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold text-gray-400 mb-2">
          <span className="bg-[#4595ff] text-white px-2 py-0.5 rounded-md font-bold whitespace-nowrap">
            {post.category?.name || 'Uncategorized'}
          </span>
          <span className="whitespace-nowrap">{post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Draft'}</span>
          <span className="flex items-center gap-1 whitespace-nowrap">
            <EyeIcon /> {post.views || 0} views
          </span>
        </div>
        
        <Link href={`/article/${post.slug}`} className="hover:underline mt-auto">
          <h3 className="font-extrabold text-[15px] sm:text-[17px] leading-tight line-clamp-2 break-words">
            {post.title}
          </h3>
        </Link>
      </div>
    </div>
  );
}
