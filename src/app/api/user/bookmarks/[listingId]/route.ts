import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { listingId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;

    await prisma.bookmark.deleteMany({
      where: { userId, listingId: params.listingId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/user/bookmarks/[listingId]]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
