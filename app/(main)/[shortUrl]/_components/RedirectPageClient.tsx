"use client";

import { getUrlDetailsByShortUrl } from "@/actions/url.action";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

type UrlDetails = Awaited<ReturnType<typeof getUrlDetailsByShortUrl>>;

interface RedirectPageClientProps {
  urlDetails: UrlDetails;
}

const RedirectPageClient = ({ urlDetails }: RedirectPageClientProps) => {
  useEffect(() => {
    const handleClick = async () => {
      const res = await fetch(`/api/redirect/${urlDetails?.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (res.ok) window.location.href = `${urlDetails?.longUrl}`;
    };
    handleClick();
  }, []);

  return (
    <>
      <BarLoader width={"100%"} color="#ffffff" />
      <br />
      Redirecting...
    </>
  );
};

export default RedirectPageClient;
