export const dynamic = "force-dynamic";
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

export async function GET(req: NextRequest) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = req.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "50", 10)));
    const skip = (page - 1) * limit;
    const search = searchParams.get("q") ?? "";

    const where: any = search
      ? { OR: [
          { title: { contains: search, mode: "insensitive" } },
          { body: { contains: search, mode: "insensitive" } },
          { author: { name: { contains: search, mode: "insensitive" } } },
          { listing: { name: { contains: search, mode: "insensitive" } } },
        ]}
      : {};

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          author: { select: { id: true, name: true, email: true } },
          listing: { select: { id: true, name: true, slug: true } },
        },
      }),
      prisma.review.count({ where }),
    ]);

    return NextResponse.json({ reviews, total, page, limit });
  } catch (error) {
    console.error("[GET /api/admin/reviews]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
