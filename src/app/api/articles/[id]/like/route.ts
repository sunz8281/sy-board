import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(request: NextRequest, { params }: Params) {
  const articleId = Number((await params).id);
  if (Number.isNaN(articleId)) {
    return NextResponse.json({ message: "id는 숫자여야 합니다." }, { status: 400 });
  }

  try {
    const headerUserId = request.headers.get("x-user-id");
    if (!headerUserId) {
      return NextResponse.json({ message: "x-user-id 헤더가 필요합니다." }, { status: 400 });
    }
    const numericUserId = Number(headerUserId);
    if (Number.isNaN(numericUserId)) {
      return NextResponse.json({ message: "x-user-id 헤더는 숫자여야 합니다." }, { status: 400 });
    }

    const existing = await prisma.articleLike.findUnique({
      where: { articleId_userId: { articleId, userId: numericUserId } },
    });

    let liked = false;
    if (existing) {
      await prisma.articleLike.delete({ where: { id: existing.id } });
      liked = false;
    } else {
      await prisma.articleLike.create({
        data: {
          articleId,
          userId: numericUserId,
        },
      });
      liked = true;
    }

    const likesCount = await prisma.articleLike.count({ where: { articleId } });

    return NextResponse.json({ liked, likesCount });
  } catch (error) {
    console.error("[POST /api/articles/:id/like]", error);
    return NextResponse.json({ message: "Failed to toggle like" }, { status: 500 });
  }
}
