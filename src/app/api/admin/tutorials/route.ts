export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  if ((session.user as any).role !== "ADMIN") return null;
  return session;
}

const tutorialSchema = z.object({
  slug: z.string().min(3).max(100).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
  title: z.string().min(5).max(200),
  description: z.string().min(10).max(500),
  category: z.string().min(2).max(100),
  readTime: z.string().min(1).max(20),
  emoji: z.string().min(1).max(10),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
  publishDate: z.string(),
  author: z.string().min(2).max(100),
  relatedTools: z.array(z.string()).optional(),
  content: z.string().min(10),
  published: z.boolean().optional(),
});

export async function GET(_req: NextRequest) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const tutorials = await prisma.tutorial.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, slug: true, title: true, category: true, difficulty: true, published: true, publishDate: true, emoji: true, readTime: true },
    });
    return NextResponse.json({ tutorials });
  } catch (error) {
    console.error("[GET /api/admin/tutorials]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const result = tutorialSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.flatten().fieldErrors }, { status: 422 });
    }

    const { relatedTools, ...data } = result.data;
    const tutorial = await prisma.tutorial.create({
      data: { ...data, relatedTools: JSON.stringify(relatedTools ?? []) },
    });
    return NextResponse.json(tutorial, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/tutorials]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // Expects: { order: [{ id, order }] }
    const { order } = await req.json();
    if (!Array.isArray(order)) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

    await Promise.all(
      order.map(({ id, order: o }: { id: string; order: number }) =>
        prisma.tutorial.update({ where: { id }, data: { order: o } })
      )
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PUT /api/admin/tutorials]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
