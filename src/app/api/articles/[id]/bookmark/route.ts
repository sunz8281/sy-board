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

    const existing = await prisma.articleBookmark.findUnique({
      where: { articleId_userId: { articleId, userId: numericUserId } },
    });

    let bookmarked = false;
    if (existing) {
      await prisma.articleBookmark.delete({ where: { id: existing.id } });
      bookmarked = false;
    } else {
      await prisma.articleBookmark.create({
        data: {
          articleId,
          userId: numericUserId,
        },
      });
      bookmarked = true;
    }

    const bookmarksCount = await prisma.articleBookmark.count({ where: { articleId } });

    return NextResponse.json({ bookmarked, bookmarksCount });
  } catch (error) {
    console.error("[POST /api/articles/:id/bookmark]", error);
    return NextResponse.json({ message: "Failed to toggle bookmark" }, { status: 500 });
  }
}
