import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://netherx.mommentx.space"),
  title: {
    default: "Nether X",
    template: "%s | Nether X",
  },
  description: "Nether X — A blog about technology, software and development.",
  openGraph: {
    siteName: "Nether X",
    type: "website",
    locale: "en_US",
    url: "https://netherx.mommentx.space",
  },
  twitter: {
    card: "summary_large_image",
    site: "@NetherX",
  },
  verification: {
    google: "MPKtElHbSG4pCpKJqhAXIDSqeu1FfaagHWVTPWr4daM",
  },
  other: {
    monetag: "0c6dc9567d69cc1c6ba6c20614086e37",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Server-side theme read — flash නැතිව correct theme apply කරනවා
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value;
  const isDark = theme === "dark";

  return (
    <html lang="en" className={isDark ? "dark" : ""}>
      <head>
        {/* Fallback: cookie නැති users සඳහා (first visit / localStorage sync) */}
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var cookie = document.cookie.split(';').find(function(c){ return c.trim().startsWith('theme='); });
                var cookieTheme = cookie ? cookie.trim().split('=')[1] : null;
                var theme = cookieTheme || localStorage.theme;
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                  if (!cookieTheme) document.cookie = 'theme=dark; path=/; max-age=31536000; SameSite=Lax';
                } else if (theme === 'light') {
                  document.documentElement.classList.remove('dark');
                  if (!cookieTheme) document.cookie = 'theme=light; path=/; max-age=31536000; SameSite=Lax';
                }
              } catch (e) {}
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