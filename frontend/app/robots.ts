import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Block admin, auth, and API routes from indexing
        disallow: ["/admin/", "/api/", "/auth/"],
      },
    ],
    sitemap: "https://netherx.mommentx.space/sitemap.xml",
    host: "https://netherx.mommentx.space",
  };
}