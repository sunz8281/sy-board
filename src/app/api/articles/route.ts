import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  let categoryFilter: number | undefined;
  if (category !== null) {
    categoryFilter = Number(category);
    if (Number.isNaN(categoryFilter)) {
      return NextResponse.json({ message: "category는 숫자여야 합니다." }, { status: 400 });
    }
  }

  try {
    const articles = await prisma.article.findMany({
      where: categoryFilter ? { categoryId: categoryFilter } : undefined,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        category: { select: { id: true, name: true } },
        author: { select: { name: true } },
        _count: { select: { comments: true } },
      },
    });

    const flattened = articles.map((article) => ({
      ...article,
      author: article.author?.name ?? null,
    }));

    return NextResponse.json(flattened);
  } catch (error) {
    console.error("[GET /api/articles]", error);
    return NextResponse.json({ message: "Failed to fetch articles" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, categoryId, authorId } = body ?? {};

    if (!title || !content || !categoryId || !authorId) {
      return NextResponse.json(
        { message: "title, content, categoryId, authorId는 모두 필수입니다." },
        { status: 400 }
      );
    }

    const article = await prisma.article.create({
      data: {
        title,
        content,
        categoryId,
        authorId,
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("[POST /api/articles]", error);
    return NextResponse.json({ message: "Failed to create article" }, { status: 500 });
  }
}
