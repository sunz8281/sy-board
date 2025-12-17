import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const USER_HEADER = "x-user-id";

export async function GET(request: NextRequest) {
  const rawUserId = request.headers.get(USER_HEADER);
  if (!rawUserId) return NextResponse.json({ message: "userId 헤더가 필요합니다." }, { status: 401 });
  const userId = Number.parseInt(rawUserId, 10);
  if (Number.isNaN(userId)) return NextResponse.json({ message: "userId 헤더는 숫자여야 합니다." }, { status: 400 });

  try {
    const entries = await prisma.timetableEntry.findMany({
      where: { userId },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });
    return NextResponse.json(entries);
  } catch (error) {
    console.error("[GET /api/timetable]", error);
    return NextResponse.json({ message: "Failed to fetch timetable" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const rawUserId = request.headers.get(USER_HEADER);
  if (!rawUserId) return NextResponse.json({ message: "userId 헤더가 필요합니다." }, { status: 401 });
  const userId = Number.parseInt(rawUserId, 10);
  if (Number.isNaN(userId)) return NextResponse.json({ message: "userId 헤더는 숫자여야 합니다." }, { status: 400 });

  try {
    const body = await request.json();
    const { title, dayOfWeek, startTime, endTime, memo } = body ?? {};
    if (!title || dayOfWeek === undefined || dayOfWeek === null || !startTime || !endTime) {
      return NextResponse.json({ message: "title, dayOfWeek, startTime, endTime는 필수입니다." }, { status: 400 });
    }
    const numericDay = Number(dayOfWeek);
    if (Number.isNaN(numericDay) || numericDay < 0 || numericDay > 6) {
      return NextResponse.json({ message: "dayOfWeek는 0~6 이어야 합니다." }, { status: 400 });
    }

    const created = await prisma.timetableEntry.create({
      data: {
        userId,
        title,
        dayOfWeek: numericDay,
        startTime: String(startTime),
        endTime: String(endTime),
        memo: memo ?? null,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("[POST /api/timetable]", error);
    return NextResponse.json({ message: "Failed to create timetable entry" }, { status: 500 });
  }
}
