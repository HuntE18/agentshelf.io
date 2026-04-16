import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  if ((session.user as any).role !== "ADMIN") return null;
  return session;
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const review = await prisma.review.findUnique({
      where: { id: params.id },
      select: { id: true, listingId: true },
    });
    if (!review) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.review.delete({ where: { id: params.id } });

    // Recalculate listing stats
    const { _avg, _count } = await prisma.review.aggregate({
      where: { listingId: review.listingId },
      _avg: { rating: true },
      _count: { rating: true },
    });
    await prisma.listing.update({
      where: { id: review.listingId },
      data: { avgRating: _avg.rating ?? 0, reviewCount: _count.rating },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/admin/reviews/[id]]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
