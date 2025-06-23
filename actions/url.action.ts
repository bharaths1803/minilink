"use server";

import prisma from "@/lib/prisma";
import { Url } from "@/types";
import { revalidatePath } from "next/cache";

export async function createUrl(data: Omit<Url, "id">) {
  try {
    let createdShortUrl: string = "";
    if (!data.shortUrl || data.shortUrl.length == 0)
      createdShortUrl = `${Math.random().toString(36).substring(2, 6)}`;
    const url = await prisma.url.create({
      data: {
        ...data,
        shortUrl:
          data.shortUrl && data.shortUrl.length > 0
            ? data.shortUrl
            : createdShortUrl,
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
    revalidatePath("/link");
    return { success: true };
  } catch (error) {
    console.log("Error in delete url", error);
    return { success: false, error };
  }
}

export async function getUrlDetails(urlId: string) {
  try {
    const url = await prisma.url.findUnique({
      where: {
        id: urlId,
      },
      include: {
        clicks: {
          select: {
            id: true,
          },
        },
      },
    });
    return url;
  } catch (error) {
    console.log("Error in getting url details", error);
    throw new Error("Error getting url details");
  }
}

export async function getDeviceDetails(urlId: string) {
  try {
    const url = await prisma.url.findUnique({
      where: {
        id: urlId,
      },
      include: {
        clicks: {
          select: {
            id: true,
            device: true,
            city: true,
            country: true,
          },
        },
      },
    });

    let deviceDetails: { [key: string]: number } = {};

    url?.clicks.forEach((click) => {
      if (!deviceDetails[click.device]) deviceDetails[click.device] = 0;
      deviceDetails[click.device] += 1;
    });

    return Object.entries(deviceDetails).map(([name, value]) => ({
      name,
      value,
    }));
  } catch (error) {
    console.log("Error in getting device details", error);
    throw new Error("Error getting device details");
  }
}

export async function getLocationDetails(urlId: string) {
  try {
    const url = await prisma.url.findUnique({
      where: {
        id: urlId,
      },
      include: {
        clicks: {
          select: {
            id: true,
            device: true,
            city: true,
            country: true,
          },
        },
      },
    });

    let locationDetails: { [key: string]: number } = {};

    url?.clicks.forEach((click) => {
      if (!locationDetails[`${click.city},${click.country}`])
        locationDetails[`${click.city},${click.country}`] = 0;
      locationDetails[`${click.city},${click.country}`] += 1;
    });

    return Object.entries(locationDetails).map(([name, count]) => ({
      name,
      count,
    }));
  } catch (error) {
    console.log("Error in getting location details", error);
    throw new Error("Error getting location details");
  }
}

export async function getUrlDetailsByShortUrl(shortUrl: string) {
  try {
    const url = await prisma.url.findFirst({
      where: {
        shortUrl,
      },
      select: {
        id: true,
        longUrl: true,
      },
    });
    return url;
  } catch (error) {
    console.log("Error in getting url details by short url", error);
    throw new Error("Error getting url details by short url");
  }
}
