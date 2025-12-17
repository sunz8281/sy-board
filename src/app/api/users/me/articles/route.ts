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
    const articles = await prisma.article.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        category: { select: { id: true, name: true } },
        _count: { select: { comments: true, likes: true, bookmarks: true } },
      },
    });

    return NextResponse.json(
      articles.map((a) => ({
        id: a.id,
        title: a.title,
        content: a.content,
        createdAt: a.createdAt,
        category: a.category,
        commentsCount: a._count.comments,
        likesCount: a._count.likes,
        bookmarksCount: a._count.bookmarks,
      }))
    );
  } catch (error) {
    console.error("[GET /api/users/me/articles]", error);
    return NextResponse.json({ message: "Failed to fetch my articles" }, { status: 500 });
  }
}
