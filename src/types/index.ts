import type {
  Listing,
  Category,
  Tag,
  Review,
  User,
  Prisma,
} from "@prisma/client";

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
