import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const linkCls = "text-[12px] font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors";

export default function Footer() {
  return (
    <footer className="bg-[#f4f9ff] dark:bg-[#050505] pt-12 pb-8 mt-16 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-24">
          
          {/* Column 1: Logo and tagline */}
          <div className="flex flex-col gap-4 max-w-xs">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/N.png" alt="Nether X N icon" width={32} height={32} className="rounded object-contain" />
              <Image src="/Nether-X.png" alt="Nether X" width={110} height={24} className="object-contain dark:invert" />
            </Link>
            <p className="text-[13px] text-gray-800 dark:text-gray-300 leading-relaxed font-medium">
              Your go-to source for the latest in tech, gaming, movies, and more.
            </p>
              <Link href="/about#newsletter" className="border-[1.5px] border-[#4595ff] text-[#4595ff] font-extrabold text-[12px] py-2 px-5 rounded-[10px] w-fit hover:bg-[#4595ff] hover:text-white transition-colors mt-2">
              Subscribe free
              </Link>
          </div>

          {/* Links Section */}
          <div className="flex flex-1 flex-col sm:flex-row gap-10 lg:gap-16">
            
            {/* Explore */}
            <div className="flex flex-col gap-2.5">
              <h3 className="font-extrabold text-[14px] text-black dark:text-white mb-1.5">Explore</h3>
              <Link href="/"            className={linkCls}>Home</Link>
              <Link href="/about"       className={linkCls}>About</Link>
              <Link href="/categories"  className={linkCls}>Categories</Link>
            </div>

            {/* Topics */}
            <div className="flex flex-col gap-2.5">
              <h3 className="font-extrabold text-[14px] text-black dark:text-white mb-1.5">Topics</h3>
              <Link href="/category/news"        className={linkCls}>News</Link>
              <Link href="/category/movies"      className={linkCls}>Movies</Link>
              <Link href="/category/games"       className={linkCls}>Games</Link>
              <Link href="/category/technology"  className={linkCls}>Technology</Link>
            </div>

            {/* Legal */}
            <div className="flex flex-col gap-2.5">
              <h3 className="font-extrabold text-[14px] text-black dark:text-white mb-1.5">Legal</h3>
              <Link href="/privacy-policy" className={linkCls}>Privacy Policy</Link>
              <Link href="/terms"          className={linkCls}>Terms of Service</Link>
            </div>

            {/* Follow us */}
            <div className="flex flex-col gap-5 lg:ml-auto">
              <h3 className="font-extrabold text-[14px] text-black dark:text-white">Follow us</h3>
              <div className="flex items-center gap-3">
                {/* Facebook */}
                <SocialIcon href="#" label="Facebook" svg={<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3.61l.39-4H14V7a1 1 0 011-1h3z" />} />
                {/* Instagram */}
                <SocialIcon href="#" label="Instagram" svg={<><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></>} />
                {/* X / Twitter */}
                <SocialIcon href="#" label="X (Twitter)" svg={<><line x1="4" y1="4" x2="20" y2="20" /><line x1="20" y1="4" x2="4" y2="20" /></>} />
                {/* LinkedIn */}
                <SocialIcon href="#" label="LinkedIn" svg={<><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></>} />
              </div>
            </div>
          </div>
        </div>

        <hr className="border-gray-300 dark:border-white/20 my-6" />

        {/* Bottom bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-extrabold text-[11px] text-black dark:text-white tracking-wide">
            © 2026 Nether X. All Rights Reserved.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/"               className="text-[12px] text-gray-700 dark:text-gray-400 font-medium hover:text-black dark:hover:text-white transition-colors">Home</Link>
            <Link href="/about"          className="text-[12px] text-gray-700 dark:text-gray-400 font-medium hover:text-black dark:hover:text-white transition-colors">About</Link>
            <Link href="/privacy-policy" className="text-[12px] text-gray-700 dark:text-gray-400 font-medium hover:text-black dark:hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms"          className="text-[12px] text-gray-700 dark:text-gray-400 font-medium hover:text-black dark:hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ href, svg, label }: { href: string; svg: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      aria-label={`Follow us on ${label}`}
      className="text-gray-400 dark:text-gray-300 hover:text-[#4595ff] dark:hover:text-[#4595ff] transition-colors"
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {svg}
      </svg>
    </a>
  );
}
