import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: {
    id: string;
  };
};

export async function PATCH(request: NextRequest, { params }: Params) {
  const articleId = Number(params.id);
  if (Number.isNaN(articleId)) {
    return NextResponse.json({ message: "id는 숫자여야 합니다." }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { title, content, categoryId } = body ?? {};

    const payload: { title?: string; content?: string; categoryId?: number } = {};
    if (title !== undefined) payload.title = title;
    if (content !== undefined) payload.content = content;
    if (categoryId !== undefined) payload.categoryId = categoryId;

    if (Object.keys(payload).length === 0) {
      return NextResponse.json({ message: "수정할 필드를 포함하세요." }, { status: 400 });
    }

    const article = await prisma.article.update({
      where: { id: articleId },
      data: payload,
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error("[PATCH /api/articles/:id]", error);
    return NextResponse.json({ message: "Failed to update article" }, { status: 500 });
  }
}
