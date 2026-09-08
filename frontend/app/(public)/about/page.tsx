import React from 'react';

export const metadata = {
  title: 'About — Nether X',
  description: 'Learn more about Nether X — your go-to source for tech, gaming, movies, and more.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-black dark:text-white transition-colors duration-200">
      <main className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">

        {/* Hero */}
        <div className="mb-12 border-t-[3px] border-[#4595ff] rounded-t-[32px] pt-10 px-0 sm:px-4">
          <span className="bg-[#4595ff] text-white px-3 py-1 rounded-[6px] tracking-widest font-extrabold uppercase text-[10px]">
            About Us
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-6 mb-4 leading-tight tracking-tight">
            We cover the things that matter to you.
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed font-medium">
            Nether X is an independent publication dedicated to delivering honest, in-depth coverage across
            technology, gaming, movies, and the latest news. Founded with a passion for great content,
            we aim to inform and entertain readers worldwide.
          </p>
        </div>

        {/* Mission */}
        <section className="mb-10">
          <h2 className="text-xl font-extrabold mb-3 text-black dark:text-white">Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
            To make complex topics simple, entertaining, and accessible to everyone — whether you're a
            first-time reader or a seasoned enthusiast. Every article is written with care, accuracy, and
            a genuine curiosity about the world.
          </p>
        </section>

        {/* Newsletter anchor */}
        <section id="newsletter" className="bg-[#f4f9ff] dark:bg-[#0c1a2e] border border-[#4595ff] rounded-2xl p-6 mt-8">
          <span className="text-[#4595ff] font-bold text-[13px]">Newsletter</span>
          <h2 className="font-bold text-[20px] mt-3 leading-tight">Stay In the Loop.</h2>
          <p className="text-gray-600 dark:text-gray-300 text-[13px] mt-2 mb-5 font-medium">
            Get weekly highlights from Nether X — curated, no spam, unsubscribe any time.
          </p>
          <button className="bg-[#4595ff] text-white font-bold text-[13px] px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity">
            Subscribe Free
          </button>
        </section>

      </main>
    </div>
  );
}
