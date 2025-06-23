"use server";

import prisma from "@/lib/prisma";

export async function getDashboardData(userId: string) {
  try {
    const links = await prisma.url.findMany({
      where: {
        userId,
      },
      include: {
        clicks: {
          select: {
            id: true,
          },
        },
      },
    });

    let clicksCnt = 0;
    links.forEach((l) => {
      clicksCnt += l.clicks.length;
    });
    const linksCnt = links.length;
    return { links, clicksCnt, linksCnt };
  } catch (error) {
    console.log("Error in getting dashboard data", error);
    throw new Error("Error getting dashboard data");
  }
}
