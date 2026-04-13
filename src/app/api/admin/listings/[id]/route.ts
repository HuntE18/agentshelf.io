import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// ─── Admin auth guard ─────────────────────────────────────────────────────────

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  if ((session.user as any).role !== "ADMIN") return null;
  return session;
}

// ─── PATCH — approve or reject a single listing ───────────────────────────────

const updateStatusSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED", "PENDING"]),
  adminNote: z.string().max(500).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const result = updateStatusSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: result.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const { status, adminNote } = result.data;

    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
      select: { id: true },
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const updated = await prisma.listing.update({
      where: { id: params.id },
      data: {
        status,
        ...(adminNote !== undefined && { adminNote }),
      },
      include: {
        category: true,
        submittedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PATCH /api/admin/listings/[id]]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ─── DELETE — remove listing ──────────────────────────────────────────────────

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
      select: { id: true },
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    await prisma.listing.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/admin/listings/[id]]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
