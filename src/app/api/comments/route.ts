import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const articleIdParam = searchParams.get("articleId");

  if (!articleIdParam) {
    return NextResponse.json({ message: "articleId는 필수입니다." }, { status: 400 });
  }

  const articleId = Number(articleIdParam);
  if (Number.isNaN(articleId)) {
    return NextResponse.json({ message: "articleId는 숫자여야 합니다." }, { status: 400 });
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { articleId },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        modified: true,
        deletedAt: true,
        parentId: true,
        author: { select: { name: true } },
      },
    });

    type CommentNode = {
      id: number;
      content: string | null;
      createdAt: Date;
      updatedAt: Date;
      modified: boolean;
      deleted: boolean;
      author: { name: string | null };
      children: CommentNode[];
    };

    const map = new Map<number, CommentNode>();
    const roots: CommentNode[] = [];

    comments.forEach((c) => {
      map.set(c.id, {
        id: c.id,
        content: c.deletedAt ? null : c.content,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        modified: c.modified,
        deleted: Boolean(c.deletedAt),
        author: c.author,
        children: [],
      });
    });

    comments.forEach((c) => {
      const node = map.get(c.id)!;
      if (c.parentId && map.has(c.parentId)) {
        map.get(c.parentId)!.children.push(node);
      } else {
        roots.push(node);
      }
    });

    return NextResponse.json(roots);
  } catch (error) {
    console.error("[GET /api/comments]", error);
    return NextResponse.json({ message: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, articleId, authorId, parentId } = body ?? {};

    if (!content || !articleId || !authorId) {
      return NextResponse.json(
        { message: "content, articleId, authorId는 모두 필수입니다." },
        { status: 400 }
      );
    }

    const parsedParentId = parentId === undefined || parentId === null ? null : Number(parentId);
    if (parsedParentId !== null && Number.isNaN(parsedParentId)) {
      return NextResponse.json({ message: "parentId는 숫자여야 합니다." }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        articleId,
        authorId,
        parentId: parsedParentId ?? undefined,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        articleId: true,
        authorId: true,
        parentId: true,
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("[POST /api/comments]", error);
    return NextResponse.json({ message: "Failed to create comment" }, { status: 500 });
  }
}
