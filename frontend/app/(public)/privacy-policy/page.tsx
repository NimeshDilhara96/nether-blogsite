import React from 'react';

export const metadata = {
  title: 'Privacy Policy — Nether X',
  description: 'Read the Nether X Privacy Policy to understand how we collect, use, and protect your data.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-black dark:text-white transition-colors duration-200">
      <main className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="border-t-[3px] border-[#4595ff] rounded-t-[32px] pt-10 px-0 sm:px-4">
          <span className="bg-[#4595ff] text-white px-3 py-1 rounded-[6px] tracking-widest font-extrabold uppercase text-[10px]">
            Legal
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-6 mb-2 leading-tight tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-gray-500 text-sm mb-10">Last updated: September 2026</p>

          <article className="prose dark:prose-invert prose-base sm:prose-lg max-w-none w-full min-w-0 text-gray-800 dark:text-gray-300 leading-relaxed">
            <h2>1. Information We Collect</h2>
            <p>
              We may collect information you provide directly (e.g., name and email when subscribing to our
              newsletter) and information collected automatically (e.g., IP address, browser type, pages visited)
              through standard web analytics tools.
            </p>

            <h2>2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Send newsletters and updates you have opted into.</li>
              <li>Improve the quality and performance of our website.</li>
              <li>Understand how readers interact with our content.</li>
              <li>Comply with applicable legal obligations.</li>
            </ul>

            <h2>3. Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your browsing experience and to display
              relevant advertisements. You can disable cookies in your browser settings, though this may affect
              site functionality.
            </p>

            <h2>4. Third-Party Services</h2>
            <p>
              We may use third-party services such as Google Analytics and Google AdSense. These services have
              their own privacy policies governing their use of your data.
            </p>

            <h2>5. Data Retention</h2>
            <p>
              We retain personal data only as long as necessary for the purposes set out in this policy, unless
              a longer retention period is required by law.
            </p>

            <h2>6. Your Rights</h2>
            <p>
              Depending on your location, you may have the right to access, correct, or delete your personal
              data. To exercise these rights, please contact us at the email below.
            </p>

            <h2>7. Contact</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@netherx.mommentx.space">privacy@netherx.mommentx.space</a>.
            </p>
          </article>
        </div>
      </main>
    </div>
  );
}
