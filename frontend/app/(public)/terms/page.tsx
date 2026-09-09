import React from 'react';

export const metadata = {
  title: 'Terms of Service — Nether X',
  description: 'Read the Nether X Terms of Service before using our website and services.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-black dark:text-white transition-colors duration-200">
      <main className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="border-t-[3px] border-[#4595ff] rounded-t-[32px] pt-10 px-0 sm:px-4">
          <span className="bg-[#4595ff] text-white px-3 py-1 rounded-[6px] tracking-widest font-extrabold uppercase text-[10px]">
            Legal
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-6 mb-2 leading-tight tracking-tight">
            Terms of Service
          </h1>
          <p className="text-gray-500 text-sm mb-10">Last updated: September 2026</p>

          <article className="prose dark:prose-invert prose-base sm:prose-lg max-w-none w-full min-w-0 text-gray-800 dark:text-gray-300 leading-relaxed">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using Nether X (&quot;the Site&quot;), you agree to be bound by these Terms of Service.
              If you do not agree, please do not use the Site.
            </p>

            <h2>2. Use of Content</h2>
            <p>
              All content published on Nether X — including articles, images, and graphics — is the intellectual
              property of Nether X or its contributors. You may share content for non-commercial purposes with
              proper attribution, but you may not reproduce it in full without written permission.
            </p>

            <h2>3. User Conduct</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the Site for any unlawful purpose.</li>
              <li>Attempt to gain unauthorised access to any part of the Site.</li>
              <li>Upload or transmit harmful, offensive, or infringing content.</li>
              <li>Use automated scripts to scrape or harvest data from the Site.</li>
            </ul>

            <h2>4. Disclaimers</h2>
            <p>
              Content on Nether X is provided for informational and entertainment purposes only. We make no
              warranties, express or implied, regarding the accuracy or completeness of any content.
            </p>

            <h2>5. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Nether X shall not be liable for any indirect, incidental,
              or consequential damages arising from your use of the Site.
            </p>

            <h2>6. Changes to Terms</h2>
            <p>
              We reserve the right to update these Terms at any time. Continued use of the Site after changes
              are posted constitutes your acceptance of the revised Terms.
            </p>

            <h2>7. Contact</h2>
            <p>
              For questions about these Terms, please contact us at{' '}
              <a href="mailto:legal@netherx.mommentx.space">legal@netherx.mommentx.space</a>.
            </p>
          </article>
        </div>
      </main>
    </div>
  );
}
