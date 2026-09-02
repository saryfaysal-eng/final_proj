import React from "react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="space-y-2">
      <div>Page new</div>
      <Link
        href={"/login"}
        className="bg-white size-1 rounded-2xl text-black p-2"
      >
        Login
      </Link>
    </div>
  );
}
