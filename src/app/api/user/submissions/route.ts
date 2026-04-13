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

    const listings = await prisma.listing.findMany({
      where: { submittedById: userId },
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        _count: { select: { reviews: true } },
      },
    });

    return NextResponse.json(listings);
  } catch (error) {
    console.error("[GET /api/user/submissions]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
