import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const USER_HEADER = "x-user-id";

export async function GET(request: NextRequest) {
  const rawUserId = request.headers.get(USER_HEADER);
  if (!rawUserId) {
    return NextResponse.json({ message: "userId 헤더가 필요합니다." }, { status: 401 });
  }
  const userId = Number.parseInt(rawUserId, 10);
  if (Number.isNaN(userId)) {
    return NextResponse.json({ message: "userId 헤더는 숫자여야 합니다." }, { status: 400 });
  }

  try {
    const bookmarks = await prisma.articleBookmark.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        createdAt: true,
        article: {
          select: {
            id: true,
            title: true,
            content: true,
            category: { select: { id: true, name: true } },
            createdAt: true,
            _count: { select: { comments: true, likes: true, bookmarks: true } },
          },
        },
      },
    });

    return NextResponse.json(
      bookmarks
        .filter((b) => b.article)
        .map((b) => ({
          id: b.article!.id,
          title: b.article!.title,
          content: b.article!.content,
          category: b.article!.category,
          createdAt: b.article!.createdAt,
          commentsCount: b.article!._count.comments,
          likesCount: b.article!._count.likes,
          bookmarksCount: b.article!._count.bookmarks,
          bookmarkedAt: b.createdAt,
        }))
    );
  } catch (error) {
    console.error("[GET /api/users/me/bookmarks]", error);
    return NextResponse.json({ message: "Failed to fetch bookmarks" }, { status: 500 });
  }
}
