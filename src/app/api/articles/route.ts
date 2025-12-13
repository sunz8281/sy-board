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
      include: {
        category: true,
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error("[GET /api/articles]", error);
    return NextResponse.json({ message: "Failed to fetch articles" }, { status: 500 });
  }
}
