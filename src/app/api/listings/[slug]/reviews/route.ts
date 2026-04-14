import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { sanitizeText } from "@/lib/sanitize";

// ─── GET — paginated reviews for listing ─────────────────────────────────────

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { searchParams } = req.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10))
    );
    const skip = (page - 1) * limit;

    const listing = await prisma.listing.findUnique({
      where: { slug: params.slug },
      select: { id: true },
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { listingId: listing.id },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          author: {
            select: { id: true, name: true, image: true },
          },
        },
      }),
      prisma.review.count({ where: { listingId: listing.id } }),
    ]);

    return NextResponse.json({
      data: reviews,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    });
  } catch (error) {
    console.error("[GET /api/listings/[slug]/reviews]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ─── POST — create review ─────────────────────────────────────────────────────

const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().min(5).max(100),
  body: z.string().min(20).max(5000),
  pros: z.array(z.string().max(100)).max(5).optional(),
  cons: z.array(z.string().max(100)).max(5).optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const listing = await prisma.listing.findUnique({
      where: { slug: params.slug },
      select: { id: true, status: true },
    });

    if (!listing || listing.status !== "APPROVED") {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const userId = (session.user as any).id;

    // Check if user already reviewed this listing
    const existingReview = await prisma.review.findFirst({
      where: { listingId: listing.id, authorId: userId },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this listing" },
        { status: 409 }
      );
    }

    const body = await req.json();
    const result = createReviewSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: result.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const { pros, cons, title, body: reviewBody, ...restData } = result.data;

    // Create review and update listing stats in a transaction
    const review = await prisma.$transaction(async (tx) => {
      const newReview = await tx.review.create({
        data: {
          ...restData,
          title: sanitizeText(title),
          body: sanitizeText(reviewBody),
          pros: pros ? JSON.stringify(pros.map(sanitizeText)) : null,
          cons: cons ? JSON.stringify(cons.map(sanitizeText)) : null,
          listingId: listing.id,
          authorId: userId,
        },
        include: {
          author: {
            select: { id: true, name: true, image: true },
          },
        },
      });

      // Recalculate average rating
      const { _avg, _count } = await tx.review.aggregate({
        where: { listingId: listing.id },
        _avg: { rating: true },
        _count: { rating: true },
      });

      await tx.listing.update({
        where: { id: listing.id },
        data: {
          avgRating: _avg.rating ?? 0,
          reviewCount: _count.rating,
        },
      });

      return newReview;
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("[POST /api/listings/[slug]/reviews]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
