"use server";

import prisma from "@/lib/prisma";
import { Url } from "@/types";
import { url } from "inspector";
import { revalidatePath } from "next/cache";

export async function createUrl(data: Omit<Url, "id">) {
  try {
    const shortUrl = `${Math.random().toString(36).substring(2, 6)}`;
    const url = await prisma.url.create({
      data: {
        ...data,
        shortUrl,
      },
    });
    revalidatePath("/dashboard");
    return { success: true, url };
  } catch (error) {
    return { success: false, error };
  }
}

export async function deleteUrl(urlId: string) {
  try {
    const url = await prisma.url.findUnique({
      where: {
        id: urlId,
      },
    });
    if (!url) throw new Error("Url not found");
    await prisma.url.delete({
      where: {
        id: urlId,
      },
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.log("Error in delete url", error);
    return { success: false, error };
  }
}
