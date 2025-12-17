import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  if (!q) {
    return NextResponse.json({ message: "q 쿼리 파라미터가 필요합니다." }, { status: 400 });
  }

  try {
    const articles = await prisma.article.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { content: { contains: q, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        title: true,
        content: true,
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
        content: a.content,
        category: a.category,
        author: a.author?.name ?? "익명",
        createdAt: a.createdAt,
        commentsCount: a._count.comments,
        likesCount: a._count.likes,
        bookmarksCount: a._count.bookmarks,
      }))
    );
  } catch (error) {
    console.error("[GET /api/search]", error);
    return NextResponse.json({ message: "Failed to search" }, { status: 500 });
  }
}
