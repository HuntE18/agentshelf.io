import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { sanitizeText } from "@/lib/sanitize";

type Params = { params: { slug: string; id: string } };

async function getReviewAndAuth(reviewId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { error: "Unauthorized", status: 401 };
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { id: true, authorId: true, listingId: true },
  });
  if (!review) return { error: "Not found", status: 404 };
  const userId = (session.user as any).id;
  const role = (session.user as any).role;
  const canAct = userId === review.authorId || role === "ADMIN";
  if (!canAct) return { error: "Forbidden", status: 403 };
  return { review, userId, role };
}

async function recalcListing(listingId: string) {
  const { _avg, _count } = await prisma.review.aggregate({
    where: { listingId },
    _avg: { rating: true },
    _count: { rating: true },
  });
  await prisma.listing.update({
    where: { id: listingId },
    data: { avgRating: _avg.rating ?? 0, reviewCount: _count.rating },
  });
}

const patchSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  title: z.string().min(5).max(100).optional(),
  body: z.string().min(20).max(5000).optional(),
});

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const auth = await getReviewAndAuth(params.id);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const body = await req.json();
    const result = patchSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.flatten().fieldErrors }, { status: 422 });
    }

    const { title, body: reviewBody, ...rest } = result.data;
    const updated = await prisma.review.update({
      where: { id: params.id },
      data: {
        ...rest,
        ...(title !== undefined && { title: sanitizeText(title) }),
        ...(reviewBody !== undefined && { body: sanitizeText(reviewBody) }),
      },
      include: { author: { select: { id: true, name: true, image: true } } },
    });

    if (result.data.rating !== undefined) {
      await recalcListing(auth.review.listingId);
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PATCH /api/listings/[slug]/reviews/[id]]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const auth = await getReviewAndAuth(params.id);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

    await prisma.review.delete({ where: { id: params.id } });
    await recalcListing(auth.review.listingId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/listings/[slug]/reviews/[id]]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
