import React from "react";
import Link from "next/link";

export default function Page() {
  return (
    <div>
      <h1>Hello</h1>
      <Link href={"/login"} className="text-blue-400 underline">
        Back to login?
      </Link>
    </div>
  );
}
