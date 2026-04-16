// ─── Base model types (mirroring Prisma schema) ───────────────────────────────
// Defined inline so this file compiles without requiring prisma generate.

export type { Prisma } from "@prisma/client";

export interface Listing {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  logoUrl: string | null;
  websiteUrl: string;
  pricingModel: string;
  pricingDetails: string | null;
  status: string;
  featured: boolean;
  premiumTier: string;
  premiumUntil: Date | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  categoryId: string;
  submittedById: string | null;
  avgRating: number;
  reviewCount: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  createdAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Review {
  id: string;
  rating: number;
  title: string;
  body: string;
  pros: string | null;
  cons: string | null;
  helpful: number;
  authorId: string;
  listingId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  passwordHash: string | null;
  role: string;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Listing ─────────────────────────────────────────────────────────────────

export type ListingWithRelations = Listing & {
  category: Category | null;
  tags: Tag[];
  reviews: ReviewWithAuthor[];
  submittedBy: Pick<User, "id" | "name" | "image"> | null;
  _count: {
    reviews: number;
    bookmarks: number;
  };
};

// ─── Review ──────────────────────────────────────────────────────────────────

export type ReviewWithAuthor = Review & {
  author: Pick<User, "id" | "name" | "image">;
};

// ─── Category ────────────────────────────────────────────────────────────────

export type CategoryWithCount = Category & {
  _count: {
    listings: number;
  };
};

// ─── Session User ─────────────────────────────────────────────────────────────

export interface SessionUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: "USER" | "ADMIN" | "MODERATOR";
}

// ─── Pricing ─────────────────────────────────────────────────────────────────

export type PricingModel = "FREE" | "FREEMIUM" | "PAID" | "OPEN_SOURCE";

export type PremiumTier = "BASIC" | "FEATURED" | "SPOTLIGHT";

export interface PricingTier {
  id: PremiumTier;
  name: string;
  monthlyPrice: number;
  description: string;
  features: string[];
  stripeMonthlyPriceId: string;
}

// ─── Pagination ──────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface ApiError {
  error: string;
  details?: Record<string, string[]>;
}

export interface ApiSuccess<T = undefined> {
  success: true;
  data?: T;
  message?: string;
}

// ─── Filters ─────────────────────────────────────────────────────────────────

export interface ListingFilters {
  categoryId?: string;
  search?: string;
  pricingModel?: PricingModel;
  minRating?: number;
  sort?: "newest" | "oldest" | "top_rated" | "most_reviewed" | "trending";
  page?: number;
  limit?: number;
}

// ─── Forms ───────────────────────────────────────────────────────────────────

export interface ListingFormValues {
  name: string;
  tagline: string;
  description: string;
  websiteUrl: string;
  logoUrl?: string;
  categoryId: string;
  pricingModel: PricingModel;
  pricingDetails?: string;
  tags?: string[];
  githubUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
}

export interface ReviewFormValues {
  rating: number;
  title: string;
  body: string;
  pros?: string[];
  cons?: string[];
}

export interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}
