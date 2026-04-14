import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const results = await prisma.listing.findMany({
      where: {
        status: "APPROVED",
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { tagline: { contains: q, mode: "insensitive" } },
        ],
      },
      select: {
        name: true,
        slug: true,
        category: { select: { name: true, icon: true } },
      },
      take: 8,
      orderBy: { viewCount: "desc" },
    });

    return NextResponse.json(results);
  } catch {
    return NextResponse.json([]);
  }
}
