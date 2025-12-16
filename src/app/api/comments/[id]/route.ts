import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }>};

export async function PATCH(request: NextRequest, { params }: Params) {
  const userHeader = request.headers.get("x-user-id");
  if (!userHeader) {
    return NextResponse.json({ message: "x-user-id 헤더가 필요합니다." }, { status: 401 });
  }
  const currentUserId = Number.parseInt(userHeader, 10);
  if (Number.isNaN(currentUserId)) {
    return NextResponse.json({ message: "x-user-id 헤더는 숫자여야 합니다." }, { status: 400 });
  }

  const idParam = (await params).id;
  if (!idParam) {
    return NextResponse.json({ message: "id는 필수입니다." }, { status: 400 });
  }
  const commentId = Number.parseInt(idParam, 10);
  if (Number.isNaN(commentId)) {
    return NextResponse.json({ message: "id는 숫자여야 합니다." }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { content } = body ?? {};
    if (!content) {
      return NextResponse.json({ message: "content는 필수입니다." }, { status: 400 });
    }

    const existing = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { deletedAt: true, authorId: true },
    });
    if (!existing) {
      return NextResponse.json({ message: "댓글을 찾을 수 없습니다." }, { status: 404 });
    }
    if (existing.deletedAt) {
      return NextResponse.json({ message: "삭제된 댓글은 수정할 수 없습니다." }, { status: 400 });
    }
    if (existing.authorId !== currentUserId) {
      return NextResponse.json({ message: "본인 댓글만 수정할 수 있습니다." }, { status: 403 });
    }

    const updated = await prisma.comment.update({
      where: { id: commentId },
      data: { content, modified: true },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        modified: true,
        parentId: true,
        authorId: true,
        articleId: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PATCH /api/comments/:id]", error);
    return NextResponse.json({ message: "Failed to update comment" }, { status: 500 });
  }
}

const hardDeleteOrphans = async (commentId: number) => {
  // delete current comment
  await prisma.comment.delete({ where: { id: commentId } });

  // climb up and delete soft-deleted parents that became orphaned
  let currentParentId: number | null | undefined = (
    await prisma.comment.findUnique({ where: { id: commentId }, select: { parentId: true } })
  )?.parentId;

  while (currentParentId) {
    const parent = await prisma.comment.findUnique({
      where: { id: currentParentId },
      select: {
        id: true,
        parentId: true,
        deletedAt: true,
        _count: { select: { children: true } },
      },
    });
    if (!parent) break;

    if (parent.deletedAt && parent._count.children === 0) {
      currentParentId = parent.parentId;
      await prisma.comment.delete({ where: { id: parent.id } });
    } else {
      break;
    }
  }
};

export async function DELETE(request: NextRequest, { params }: Params) {
  const userHeader = request.headers.get("x-user-id");
  if (!userHeader) {
    return NextResponse.json({ message: "x-user-id 헤더가 필요합니다." }, { status: 401 });
  }
  const currentUserId = Number.parseInt(userHeader, 10);
  if (Number.isNaN(currentUserId)) {
    return NextResponse.json({ message: "x-user-id 헤더는 숫자여야 합니다." }, { status: 400 });
  }

  const idParam = (await params).id;
  if (!idParam) {
    return NextResponse.json({ message: "id는 필수입니다." }, { status: 400 });
  }
  const commentId = Number.parseInt(idParam, 10);
  if (Number.isNaN(commentId)) {
    return NextResponse.json({ message: "id는 숫자여야 합니다." }, { status: 400 });
  }

  try {
    const target = await prisma.comment.findUnique({
      where: { id: commentId },
      select: {
        id: true,
        parentId: true,
        deletedAt: true,
        authorId: true,
        _count: { select: { children: true } },
      },
    });
    if (!target) {
      return NextResponse.json({ message: "댓글을 찾을 수 없습니다." }, { status: 404 });
    }
    if (target.authorId !== currentUserId) {
      return NextResponse.json({ message: "본인 댓글만 삭제할 수 있습니다." }, { status: 403 });
    }

    if (target._count.children > 0) {
      if (!target.deletedAt) {
        await prisma.comment.update({
          where: { id: commentId },
          data: {
            deletedAt: new Date(),
            content: "",
            modified: true,
          },
        });
      }
      return NextResponse.json({ deleted: "soft" });
    }

    await prisma.comment.delete({ where: { id: commentId } });

    // recursively remove orphaned parents that were soft-deleted and now have no children
    let parentId = target.parentId;
    while (parentId) {
      const parent = await prisma.comment.findUnique({
        where: { id: parentId },
        select: { id: true, parentId: true, deletedAt: true, _count: { select: { children: true } } },
      });
      if (!parent) break;

      if (parent.deletedAt && parent._count.children === 0) {
        const nextParent = parent.parentId;
        await prisma.comment.delete({ where: { id: parent.id } });
        parentId = nextParent;
      } else {
        break;
      }
    }

    return NextResponse.json({ deleted: "hard" });
  } catch (error) {
    console.error("[DELETE /api/comments/:id]", error);
    return NextResponse.json({ message: "Failed to delete comment" }, { status: 500 });
  }
}
