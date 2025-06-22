import { signJwt } from "@/lib/auth";
import { verifyPassword } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user || !(await verifyPassword(password, user.password)))
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const token = signJwt(user.id);

  (await cookies()).set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });

  return NextResponse.json({ success: true });
}
