import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@utils/password";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body ?? {};

    if (!email || !password) {
      return NextResponse.json({ message: "email과 password는 필수입니다." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ message: "비밀번호는 6자 이상이어야 합니다." }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ message: "이미 사용 중인 이메일입니다." }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: name?.trim() ? name.trim() : undefined,
      },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    const response = NextResponse.json({ user });
    response.headers.set("x-user-id", String(user.id));
    return response;
  } catch (error) {
    console.error("[POST /api/auth/register]", error);
    return NextResponse.json({ message: "Failed to register" }, { status: 500 });
  }
}
