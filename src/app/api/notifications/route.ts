import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const USER_HEADER = "x-user-id";

export async function GET(request: NextRequest) {
  const rawUserId = request.headers.get(USER_HEADER);
  if (!rawUserId) {
    return NextResponse.json({ message: "userId 헤더가 필요합니다." }, { status: 401 });
  }
  const userId = Number.parseInt(rawUserId, 10);
  if (Number.isNaN(userId)) {
    return NextResponse.json({ message: "userId 헤더는 숫자여야 합니다." }, { status: 400 });
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json(notifications);
  } catch (error) {
    console.error("[GET /api/notifications]", error);
    return NextResponse.json({ message: "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const rawUserId = request.headers.get(USER_HEADER);
  if (!rawUserId) {
    return NextResponse.json({ message: "userId 헤더가 필요합니다." }, { status: 401 });
  }
  const userId = Number.parseInt(rawUserId, 10);
  if (Number.isNaN(userId)) {
    return NextResponse.json({ message: "userId 헤더는 숫자여야 합니다." }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { message, link } = body ?? {};
    if (!message || typeof message !== "string") {
      return NextResponse.json({ message: "message는 필수입니다." }, { status: 400 });
    }

    const created = await prisma.notification.create({
      data: { userId, message, link },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("[POST /api/notifications]", error);
    return NextResponse.json({ message: "Failed to create notification" }, { status: 500 });
  }
}
