"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function SearchInput() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md p-3 border-b w-150 border-gray-800">
      <div className="relative">
        <input
          type="text"
          placeholder="Search accounts..."
          defaultValue={searchParams.get("q")?.toString()}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full bg-gray-900 text-white placeholder-gray-500 rounded-full py-2.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
        />
        <svg
          className="absolute left-4 top-3.5 h-4 w-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  );
}
