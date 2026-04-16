export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const tutorial = await prisma.tutorial.findUnique({ where: { slug: params.slug } });
    if (!tutorial) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(tutorial);
  } catch (error) {
    console.error("[GET /api/tutorials/[slug]]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
