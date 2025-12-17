import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const USER_HEADER = "x-user-id";

type Params = { params: { id: string } };

export async function PATCH(request: NextRequest, { params }: Params) {
  const rawUserId = request.headers.get(USER_HEADER);
  if (!rawUserId) {
    return NextResponse.json({ message: "userId 헤더가 필요합니다." }, { status: 401 });
  }
  const userId = Number.parseInt(rawUserId, 10);
  if (Number.isNaN(userId)) {
    return NextResponse.json({ message: "userId 헤더는 숫자여야 합니다." }, { status: 400 });
  }

  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ message: "id는 숫자여야 합니다." }, { status: 400 });
  }

  try {
    const existing = await prisma.notification.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ message: "알림을 찾을 수 없습니다." }, { status: 404 });
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { read: true },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PATCH /api/notifications/:id]", error);
    return NextResponse.json({ message: "Failed to update notification" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const rawUserId = request.headers.get(USER_HEADER);
  if (!rawUserId) {
    return NextResponse.json({ message: "userId 헤더가 필요합니다." }, { status: 401 });
  }
  const userId = Number.parseInt(rawUserId, 10);
  if (Number.isNaN(userId)) {
    return NextResponse.json({ message: "userId 헤더는 숫자여야 합니다." }, { status: 400 });
  }

  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ message: "id는 숫자여야 합니다." }, { status: 400 });
  }

  try {
    const existing = await prisma.notification.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ message: "알림을 찾을 수 없습니다." }, { status: 404 });
    }

    await prisma.notification.delete({ where: { id } });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("[DELETE /api/notifications/:id]", error);
    return NextResponse.json({ message: "Failed to delete notification" }, { status: 500 });
  }
}
