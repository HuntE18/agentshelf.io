export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const tutorials = await prisma.tutorial.findMany({
      where: { published: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    return NextResponse.json(tutorials);
  } catch (error) {
    console.error("[GET /api/tutorials]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
