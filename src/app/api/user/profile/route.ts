import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const updateProfileSchema = z.object({
  name: z.string().min(1).max(60).optional(),
  bio: z.string().max(500).optional(),
});

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const body = await req.json();
    const result = updateProfileSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.flatten() }, { status: 422 });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: result.data,
      select: { id: true, name: true, email: true, image: true, bio: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PUT /api/user/profile]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
