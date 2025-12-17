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
    const comments = await prisma.comment.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        content: true,
        createdAt: true,
        article: {
          select: {
            id: true,
            title: true,
            category: { select: { id: true, name: true } },
            _count: { select: { comments: true, likes: true, bookmarks: true } },
          },
        },
      },
    });

    return NextResponse.json(
      comments.map((c) => ({
        id: c.id,
        content: c.content,
        createdAt: c.createdAt,
        article: c.article
          ? {
              id: c.article.id,
              title: c.article.title,
              category: c.article.category,
              commentsCount: c.article._count.comments,
              likesCount: c.article._count.likes,
              bookmarksCount: c.article._count.bookmarks,
            }
          : null,
      }))
    );
  } catch (error) {
    console.error("[GET /api/users/me/comments]", error);
    return NextResponse.json({ message: "Failed to fetch my comments" }, { status: 500 });
  }
}
