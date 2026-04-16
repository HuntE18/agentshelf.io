export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        listing: {
          select: {
            id: true,
            name: true,
            slug: true,
            tagline: true,
            logoUrl: true,
            websiteUrl: true,
            pricingModel: true,
            category: { select: { name: true, icon: true } },
            _count: { select: { reviews: true } },
          },
        },
      },
    });

    return NextResponse.json(bookmarks);
  } catch (error) {
    console.error("[GET /api/user/bookmarks]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
