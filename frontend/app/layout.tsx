import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",      // font load වෙනකල් fallback font show කරනවා (FCP improve)
  preload: true,        // critical font pre-fetch කරනවා
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Nether X",
    template: "%s | Nether X",
  },
  description: "Nether X — A blog about technology, software and development.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                // 1. Cookie check (server-side render compat)
                var cookie = document.cookie.split(';').find(function(c){ return c.trim().startsWith('theme='); });
                var cookieTheme = cookie ? cookie.trim().split('=')[1] : null;

                // 2. Fallback: localStorage
                var theme = cookieTheme || localStorage.theme;

                // 3. Fallback: OS preference
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }

                // cookie නැතිනම් sync කරමු
                if (!cookieTheme && theme) {
                  document.cookie = 'theme=' + theme + '; path=/; max-age=31536000; SameSite=Lax';
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className={`${inter.className} bg-[#f4f9ff] dark:bg-[#0a0a0a] text-black dark:text-white`}>
        {children}
      </body>
    </html>
  );
}