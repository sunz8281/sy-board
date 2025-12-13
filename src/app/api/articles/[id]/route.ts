import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: NextRequest, { params }: Params) {
  const idParam = (await params)?.id;
  if (!idParam) {
    return NextResponse.json({ message: "id는 필수입니다." }, { status: 400 });
  }

  const articleId = Number.parseInt(idParam, 10);
  if (Number.isNaN(articleId)) {
    return NextResponse.json({ message: "id는 숫자여야 합니다." }, { status: 400 });
  }

  try {
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        category: { select: { id: true, name: true } },
        author: { select: { name: true } },
        _count: { select: { comments: true, likes: true, bookmarks: true } },
        comments: {
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
        },
      },
    });

    if (!article) {
      return NextResponse.json({ message: "게시글을 찾을 수 없습니다." }, { status: 404 });
    }

    type CommentNode = {
      id: number;
      content: string | null;
      createdAt: Date;
      updatedAt: Date;
      modified: boolean;
      deleted: boolean;
      author: string | null;
      children: CommentNode[];
    };

    const map = new Map<number, CommentNode>();
    const roots: CommentNode[] = [];

    article.comments.forEach((c) => {
      map.set(c.id, {
        id: c.id,
        content: c.deletedAt ? null : c.content,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        modified: c.modified,
        deleted: Boolean(c.deletedAt),
        author: c.author?.name ?? null,
        children: [],
      });
    });

    article.comments.forEach((c) => {
      const node = map.get(c.id)!;
      if (c.parentId && map.has(c.parentId)) {
        map.get(c.parentId)!.children.push(node);
      } else {
        roots.push(node);
      }
    });

    const result = {
      id: article.id,
      title: article.title,
      content: article.content,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      category: article.category,
      author: article.author?.name ?? null,
      comments: roots,
      commentsCount: article._count?.comments ?? 0,
      likesCount: article._count?.likes ?? 0,
      bookmarksCount: article._count?.bookmarks ?? 0,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET /api/articles/:id]", error);
    return NextResponse.json({ message: "Failed to fetch article" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const resolved = typeof (params as any)?.then === "function" ? await (params as any) : params;
  const idParam = resolved?.id;
  if (!idParam) {
    return NextResponse.json({ message: "id는 필수입니다." }, { status: 400 });
  }

  const articleId = Number.parseInt(idParam, 10);
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

export async function DELETE(_request: NextRequest, { params }: Params) {
  const idParam = (await params)?.id;
  if (!idParam) {
    return NextResponse.json({ message: "id는 필수입니다." }, { status: 400 });
  }

  const articleId = Number.parseInt(idParam, 10);
  if (Number.isNaN(articleId)) {
    return NextResponse.json({ message: "id는 숫자여야 합니다." }, { status: 400 });
  }

  try {
    const existing = await prisma.article.findUnique({ where: { id: articleId }, select: { id: true } });
    if (!existing) {
      return NextResponse.json({ message: "게시글을 찾을 수 없습니다." }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.comment.deleteMany({ where: { articleId } }),
      prisma.articleLike.deleteMany({ where: { articleId } }),
      prisma.articleBookmark.deleteMany({ where: { articleId } }),
      prisma.article.delete({ where: { id: articleId } }),
    ]);
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("[DELETE /api/articles/:id]", error);
    return NextResponse.json({ message: "Failed to delete article" }, { status: 500 });
  }
}
