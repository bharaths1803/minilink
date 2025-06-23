import { signJwt } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";
import { hashPassword, verifyPassword } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password, username, profilePic } = await req.json();
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser)
    return NextResponse.json(
      { error: "Email already registered" },
      { status: 400 }
    );

  const cloudinaryResult = await cloudinary.uploader.upload(profilePic);
  const profilePicUrl = cloudinaryResult.secure_url;

  const hashedPassword = await hashPassword(password);

  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      username,
      profilePicUrl,
    },
  });

  const token = signJwt(newUser.id);

  (await cookies()).set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
    sameSite: "lax",
  });

  return NextResponse.json({ success: true });
}
