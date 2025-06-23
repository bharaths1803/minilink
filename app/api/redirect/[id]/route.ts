import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ??
    req.headers.get("x-real-ip") ??
    "203.0.113.45";
  const ua = req.headers.get("user-agent") || "";
  console.log("User agent", ua);
  const parser = new UAParser(ua);
  const result = parser.getResult();
  console.log("Pasrsed result", result);
  const device = parser.getDevice().type || "desktop";
  console.log("Device name", parser.getDevice().type);
  const geoRes = await fetch(`https://ipwho.is/${ip}`);
  const { city, country } = await geoRes.json();

  const click = await prisma.click.create({
    data: {
      city,
      country,
      device,
      urlId: id,
    },
  });

  return NextResponse.json({ success: true });
}
