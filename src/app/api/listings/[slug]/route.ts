import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// ─── GET — single listing by slug ────────────────────────────────────────────

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const listing = await prisma.listing.findUnique({
      where: { slug: params.slug },
      include: {
        category: true,
        tags: true,
        submittedBy: {
          select: { id: true, name: true, image: true },
        },
        reviews: {
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            author: {
              select: { id: true, name: true, image: true },
            },
          },
        },
        _count: {
          select: { reviews: true, bookmarks: true },
        },
      },
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    // Only serve approved listings to the public (admins can see pending)
    const session = await getServerSession(authOptions);
    const isAdmin = (session?.user as any)?.role === "ADMIN";
    const isOwner = (session?.user as any)?.id === listing.submittedById;

    if (listing.status !== "APPROVED" && !isAdmin && !isOwner) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    // Increment view count (fire-and-forget)
    prisma.listing
      .update({
        where: { id: listing.id },
        data: { viewCount: { increment: 1 } },
      })
      .catch(() => {});

    return NextResponse.json(listing);
  } catch (error) {
    console.error("[GET /api/listings/[slug]]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ─── PATCH — update listing ───────────────────────────────────────────────────

const updateListingSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  tagline: z.string().min(10).max(200).optional(),
  description: z.string().min(20).max(5000).optional(),
  websiteUrl: z.string().url().optional(),
  logoUrl: z.string().url().optional().nullable(),
  pricingModel: z.enum(["FREE", "FREEMIUM", "PAID", "OPEN_SOURCE"]).optional(),
  pricingDetails: z.string().max(500).optional().nullable(),
  githubUrl: z.string().url().optional().nullable().or(z.literal("")),
  twitterUrl: z.string().url().optional().nullable().or(z.literal("")),
});

export async function PATCH(
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
      select: { id: true, submittedById: true },
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const userId = (session.user as any).id;
    const isAdmin = (session.user as any).role === "ADMIN";
    const isOwner = listing.submittedById === userId;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const result = updateListingSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: result.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const updated = await prisma.listing.update({
      where: { id: listing.id },
      data: result.data,
      include: {
        category: true,
        tags: true,
        _count: { select: { reviews: true, bookmarks: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PATCH /api/listings/[slug]]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
