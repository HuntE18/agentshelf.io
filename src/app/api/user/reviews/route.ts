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

    const reviews = await prisma.review.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        listing: {
          select: { id: true, name: true, slug: true, logoUrl: true },
        },
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("[GET /api/user/reviews]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
