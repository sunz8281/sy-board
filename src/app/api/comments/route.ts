import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, articleId, authorId } = body ?? {};

    if (!content || !articleId || !authorId) {
      return NextResponse.json(
        { message: "content, articleId, authorId는 모두 필수입니다." },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        articleId,
        authorId,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        articleId: true,
        authorId: true,
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("[POST /api/comments]", error);
    return NextResponse.json({ message: "Failed to create comment" }, { status: 500 });
  }
}
