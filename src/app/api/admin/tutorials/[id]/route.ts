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

const patchSchema = z.object({
  title: z.string().min(5).max(200).optional(),
  description: z.string().min(10).max(500).optional(),
  category: z.string().min(2).max(100).optional(),
  readTime: z.string().min(1).max(20).optional(),
  emoji: z.string().min(1).max(10).optional(),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
  publishDate: z.string().optional(),
  author: z.string().min(2).max(100).optional(),
  relatedTools: z.array(z.string()).optional(),
  content: z.string().min(10).optional(),
  published: z.boolean().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const result = patchSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.flatten().fieldErrors }, { status: 422 });
    }

    const { relatedTools, ...data } = result.data;
    const updated = await prisma.tutorial.update({
      where: { id: params.id },
      data: {
        ...data,
        ...(relatedTools !== undefined ? { relatedTools: JSON.stringify(relatedTools) } : {}),
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PATCH /api/admin/tutorials/[id]]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await prisma.tutorial.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/admin/tutorials/[id]]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const tutorial = await prisma.tutorial.findUnique({ where: { id: params.id } });
    if (!tutorial) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(tutorial);
  } catch (error) {
    console.error("[GET /api/admin/tutorials/[id]]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
