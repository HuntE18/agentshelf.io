import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const listing = await prisma.listing.findUnique({
      where: { slug: params.slug },
      select: { id: true },
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    // Check if bookmark already exists
    const existing = await prisma.bookmark.findFirst({
      where: { userId, listingId: listing.id },
    });

    if (existing) {
      // Remove bookmark
      await prisma.bookmark.delete({ where: { id: existing.id } });
      return NextResponse.json({ bookmarked: false });
    } else {
      // Create bookmark
      await prisma.bookmark.create({
        data: { userId, listingId: listing.id },
      });
      return NextResponse.json({ bookmarked: true });
    }
  } catch (error) {
    console.error("[POST /api/listings/[slug]/bookmark]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ bookmarked: false });
    }
    const userId = (session.user as any).id;
    const listing = await prisma.listing.findUnique({
      where: { slug: params.slug },
      select: { id: true },
    });
    if (!listing) return NextResponse.json({ bookmarked: false });
    const bookmark = await prisma.bookmark.findFirst({
      where: { userId, listingId: listing.id },
    });
    return NextResponse.json({ bookmarked: !!bookmark });
  } catch {
    return NextResponse.json({ bookmarked: false });
  }
}
