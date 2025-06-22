"use client";

import Link from "next/link";
import { useState } from "react";

const UrlInput = () => {
  const [longUrl, setLongUrl] = useState<string>("");

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <input
        type="url"
        value={longUrl}
        placeholder="Paste your long URL here..."
        className="border border-white placeholder-white px-4 py-3 bg-black text-white focus:outline-none text-lg flex-1"
        onChange={(e) => setLongUrl(e.target.value)}
      />
      <Link
        href={`/dashboard/${longUrl}`}
        className="px-8 py-3 bg-white hover:bg-black transition-colors duration-300 text-black hover:text-white border border-black hover:border-white font-semibold"
      >
        Shorten
      </Link>
    </div>
  );
};

export default UrlInput;
