import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@utils/password";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: "asc" },
      select: { id: true, email: true, name: true, createdAt: true },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("[GET /api/users]", error);
    return NextResponse.json({ message: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, password } = body ?? {};

    if (!email || !password) {
      return NextResponse.json({ message: "email과 password는 필수입니다." }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
      },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("[POST /api/users]", error);
    return NextResponse.json({ message: "Failed to create user" }, { status: 500 });
  }
}
