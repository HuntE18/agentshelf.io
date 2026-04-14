import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { rateLimit } from "@/lib/rate-limit";

// ─── GET — list listings with filters ────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const categoryId = searchParams.get("categoryId") ?? undefined;
    const search = searchParams.get("search") ?? undefined;
    const pricingModel = searchParams.get("pricingModel") ?? undefined;
    const minRating = searchParams.get("minRating")
      ? parseFloat(searchParams.get("minRating")!)
      : undefined;
    const sort = searchParams.get("sort") ?? "newest";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("limit") ?? "12", 10))
    );
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      status: "APPROVED",
      ...(categoryId && { categoryId }),
      ...(pricingModel && { pricingModel }),
      ...(minRating !== undefined && { avgRating: { gte: minRating } }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { tagline: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { tags: { some: { name: { contains: search, mode: "insensitive" } } } },
        ],
      }),
    };

    // Build orderBy clause
    const orderBy: any =
      sort === "oldest"
        ? { createdAt: "asc" }
        : sort === "top_rated"
        ? { avgRating: "desc" }
        : sort === "most_reviewed"
        ? { reviewCount: "desc" }
        : sort === "trending"
        ? { viewCount: "desc" }
        : { createdAt: "desc" };

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: true,
          tags: true,
          submittedBy: {
            select: { id: true, name: true, image: true },
          },
          _count: {
            select: { reviews: true, bookmarks: true },
          },
          reviews: {
            take: 0, // just for type compat
          },
        },
      }),
      prisma.listing.count({ where }),
    ]);

    return NextResponse.json({
      data: listings,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    });
  } catch (error) {
    console.error("[GET /api/listings]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ─── POST — create listing ────────────────────────────────────────────────────

const createListingSchema = z.object({
  name: z.string().min(2).max(100),
  tagline: z.string().min(10).max(200),
  description: z.string().min(20).max(5000),
  websiteUrl: z.string().url(),
  logoUrl: z.string().url().optional(),
  categoryId: z.string().cuid(),
  pricingModel: z.enum(["FREE", "FREEMIUM", "PAID", "OPEN_SOURCE"]),
  pricingDetails: z.string().max(500).optional(),
  tags: z.array(z.string()).max(10).optional(),
  githubUrl: z.string().url().optional().or(z.literal("")),
  twitterUrl: z.string().url().optional().or(z.literal("")),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!rateLimit(`submit:${(session.user as any).id}`, 5, 24 * 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many listing submissions. Please try again tomorrow." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const result = createListingSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: result.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const { name, tags, ...rest } = result.data;
    const slug = slugify(name);

    // Ensure slug is unique
    const existing = await prisma.listing.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const listing = await prisma.listing.create({
      data: {
        ...rest,
        name,
        slug: finalSlug,
        status: "PENDING",
        submittedById: (session.user as any).id,
        ...(tags && tags.length > 0
          ? {
              tags: {
                connectOrCreate: tags.map((tag) => ({
                  where: { name: tag },
                  create: { name: tag, slug: slugify(tag) },
                })),
              },
            }
          : {}),
      },
      include: {
        category: true,
        tags: true,
      },
    });

    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    console.error("[POST /api/listings]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
