import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const BASE_URL = "https://netherx.mommentx.space";

export const revalidate = 3600; // Rebuild sitemap hourly via ISR

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  // Fetch all published articles
  const { data: posts } = await supabase
    .from("posts")
    .select("slug, updated_at, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  // Fetch all categories
  const { data: categories } = await supabase
    .from("categories")
    .select("slug, updated_at");

  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Dynamic article routes
  const articleRoutes: MetadataRoute.Sitemap = (posts ?? []).map((post) => ({
    url: `${BASE_URL}/article/${post.slug}`,
    lastModified: post.updated_at ?? post.published_at ?? new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // Dynamic category routes
  const categoryRoutes: MetadataRoute.Sitemap = (categories ?? []).map(
    (cat) => ({
      url: `${BASE_URL}/category/${cat.slug}`,
      lastModified: cat.updated_at ?? new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })
  );

  return [...staticRoutes, ...articleRoutes, ...categoryRoutes];
}