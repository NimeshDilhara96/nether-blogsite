import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '../Icons';
import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null;

  // Simple logic to show a few pages around the current page
  const getVisiblePages = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }).map((_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  };

  const pages = getVisiblePages();

  return (
    <div className="flex items-center justify-center gap-2 mt-10 pt-6 border-t border-gray-200 dark:border-zinc-800">
      {currentPage > 1 ? (
        <Link href={`/?page=${currentPage - 1}`} className="w-7 h-7 flex items-center justify-center border border-gray-200 dark:border-zinc-700 rounded text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
          <ChevronLeftIcon />
        </Link>
      ) : (
        <button disabled className="w-7 h-7 flex items-center justify-center border border-gray-200 dark:border-zinc-700 rounded text-gray-400 opacity-50 cursor-not-allowed">
          <ChevronLeftIcon />
        </button>
      )}

      {pages[0] > 1 && (
        <>
          <Link href="/?page=1" className="w-7 h-7 flex items-center justify-center border border-gray-200 dark:border-zinc-700 rounded text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 font-bold text-xs transition-colors">1</Link>
          {pages[0] > 2 && <span className="text-gray-400 text-xs tracking-widest">...</span>}
        </>
      )}

      {pages.map(page => (
        <Link 
          key={page} 
          href={`/?page=${page}`} 
          className={`w-7 h-7 flex items-center justify-center rounded font-bold text-xs transition-colors ${currentPage === page ? 'bg-[#4595ff] text-white border border-[#4595ff]' : 'border border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800'}`}
        >
          {page}
        </Link>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && <span className="text-gray-400 text-xs tracking-widest">...</span>}
          <Link href={`/?page=${totalPages}`} className="w-7 h-7 flex items-center justify-center border border-gray-200 dark:border-zinc-700 rounded text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 font-bold text-xs transition-colors">{totalPages}</Link>
        </>
      )}

      {currentPage < totalPages ? (
        <Link href={`/?page=${currentPage + 1}`} className="w-7 h-7 flex items-center justify-center border border-gray-200 dark:border-zinc-700 rounded text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
          <ChevronRightIcon />
        </Link>
      ) : (
        <button disabled className="w-7 h-7 flex items-center justify-center border border-gray-200 dark:border-zinc-700 rounded text-gray-400 opacity-50 cursor-not-allowed">
          <ChevronRightIcon />
        </button>
      )}
    </div>
  );
}
