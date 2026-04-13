import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const newsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = newsletterSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: result.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const { email } = result.data;

    // Upsert subscriber (idempotent)
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { updatedAt: new Date() },
      create: { email, subscribedAt: new Date() },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[POST /api/newsletter]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
