import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { TUTORIALS } from "@/content/tutorials";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.agentshelf.io";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/browse`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tutorials`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // All approved listings from database
  let listingPages: MetadataRoute.Sitemap = [];
  try {
    const listings = await prisma.listing.findMany({
      where: { status: "APPROVED" },
      select: { slug: true, updatedAt: true },
    });

    listingPages = listings.map((listing: any) => ({
      url: `${baseUrl}/listing/${listing.slug}`,
      lastModified: listing.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error("[sitemap] Failed to fetch listings:", error);
  }

  // All categories
  let categoryPages: MetadataRoute.Sitemap = [];
  try {
    const categories = await prisma.category.findMany({
      select: { slug: true },
    });

    categoryPages = categories.map((cat: any) => ({
      url: `${baseUrl}/browse?category=${encodeURIComponent(cat.slug)}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error("[sitemap] Failed to fetch categories:", error);
  }

  // All stacks
  let stackPages: MetadataRoute.Sitemap = [];
  try {
    const stacks = await prisma.stack.findMany({
      select: { slug: true, updatedAt: true },
    });

    stackPages = stacks.map((stack: any) => ({
      url: `${baseUrl}/stacks/${stack.slug}`,
      lastModified: stack.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    // Stacks table may not exist yet — that's fine
    console.error("[sitemap] Failed to fetch stacks:", error);
  }

  // Tutorial pages (from static content)
  const tutorialPages: MetadataRoute.Sitemap = TUTORIALS.map((tutorial) => ({
    url: `${baseUrl}/tutorials/${tutorial.slug}`,
    lastModified: new Date(tutorial.publishDate),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...listingPages,
    ...categoryPages,
    ...stackPages,
    ...tutorialPages,
  ];
}