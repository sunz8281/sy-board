import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const USER_HEADER = "x-user-id";

type Params = { params: { id: string } };

export async function PATCH(request: NextRequest, { params }: Params) {
  const rawUserId = request.headers.get(USER_HEADER);
  if (!rawUserId) return NextResponse.json({ message: "userId 헤더가 필요합니다." }, { status: 401 });
  const userId = Number.parseInt(rawUserId, 10);
  if (Number.isNaN(userId)) return NextResponse.json({ message: "userId 헤더는 숫자여야 합니다." }, { status: 400 });

  const entryId = Number(params.id);
  if (Number.isNaN(entryId)) return NextResponse.json({ message: "id는 숫자여야 합니다." }, { status: 400 });

  try {
    const existing = await prisma.timetableEntry.findUnique({ where: { id: entryId } });
    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ message: "시간표 항목을 찾을 수 없습니다." }, { status: 404 });
    }

    const body = await request.json();
    const { title, dayOfWeek, startTime, endTime, memo } = body ?? {};
    const payload: any = {};
    if (title !== undefined) payload.title = title;
    if (dayOfWeek !== undefined) payload.dayOfWeek = Number(dayOfWeek);
    if (startTime !== undefined) payload.startTime = String(startTime);
    if (endTime !== undefined) payload.endTime = String(endTime);
    if (memo !== undefined) payload.memo = memo ?? null;

    const updated = await prisma.timetableEntry.update({ where: { id: entryId }, data: payload });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PATCH /api/timetable/:id]", error);
    return NextResponse.json({ message: "Failed to update timetable entry" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const rawUserId = request.headers.get(USER_HEADER);
  if (!rawUserId) return NextResponse.json({ message: "userId 헤더가 필요합니다." }, { status: 401 });
  const userId = Number.parseInt(rawUserId, 10);
  if (Number.isNaN(userId)) return NextResponse.json({ message: "userId 헤더는 숫자여야 합니다." }, { status: 400 });

  const entryId = Number(params.id);
  if (Number.isNaN(entryId)) return NextResponse.json({ message: "id는 숫자여야 합니다." }, { status: 400 });

  try {
    const existing = await prisma.timetableEntry.findUnique({ where: { id: entryId } });
    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ message: "시간표 항목을 찾을 수 없습니다." }, { status: 404 });
    }

    await prisma.timetableEntry.delete({ where: { id: entryId } });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("[DELETE /api/timetable/:id]", error);
    return NextResponse.json({ message: "Failed to delete timetable entry" }, { status: 500 });
  }
}
