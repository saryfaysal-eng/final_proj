"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProfileTabs({ username }: { username: string }) {
  const pathname = usePathname();
  const basePath = `/${username}`;
  const repliesPath = `/${username}/with_replies`;
  const isRepliesTab = pathname === repliesPath;

  return (
    <div className="border-b border-gray-800 flex items-center h-13 font-bold text-sm mt-4">
      <Link
        href={basePath}
        className="flex-1 h-full flex items-center justify-center hover:bg-zinc-900/60 transition"
      >
        <span
          className={`relative h-full flex items-center border-b-4 ${
            !isRepliesTab
              ? "border-sky-500 text-white font-bold"
              : "border-transparent text-gray-500"
          }`}
        >
          Posts
        </span>
      </Link>

      <Link
        href={repliesPath}
        className="flex-1 h-full flex items-center justify-center hover:bg-zinc-900/60 transition"
      >
        <span
          className={`relative h-full flex items-center border-b-4 ${
            isRepliesTab
              ? "border-sky-500 text-white font-bold"
              : "border-transparent text-gray-500"
          }`}
        >
          Replies
        </span>
      </Link>
    </div>
  );
}
