import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const since = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7); // 7d
  try {
    const articles = await prisma.article.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { bookmarks: { _count: "desc" } },
      take: 10,
      select: {
        id: true,
        title: true,
        createdAt: true,
        category: { select: { id: true, name: true } },
        author: { select: { name: true } },
        _count: { select: { comments: true, likes: true, bookmarks: true } },
      },
    });

    return NextResponse.json(
      articles.map((a) => ({
        id: a.id,
        title: a.title,
        category: a.category,
        author: a.author?.name ?? "익명",
        createdAt: a.createdAt,
        commentsCount: a._count.comments,
        likesCount: a._count.likes,
        bookmarksCount: a._count.bookmarks,
      }))
    );
  } catch (error) {
    console.error("[GET /api/articles/hot]", error);
    return NextResponse.json({ message: "Failed to fetch hot articles" }, { status: 500 });
  }
}
