"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/app/actions/auth";

export default function LogoutClient() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-zinc-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-black border border-gray-800 rounded-2xl p-8 max-w-xs w-full text-white shadow-2xl flex flex-col items-start text-left">
        <div className="w-8 h-8 mb-4 flex items-center justify-center self-center">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="w-8 h-8 fill-white"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </div>

        <h1 className="text-xl font-bold mb-2">Log out of X?</h1>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          You can always log back in at any time. If you just want to switch
          accounts, you can do that by adding an existing account.
        </p>

        <form action={logout} className="w-full">
          <button
            type="submit"
            className="cursor-pointer w-full bg-white text-black font-bold py-3 rounded-full hover:bg-neutral-200 active:bg-neutral-300 transition select-none"
          >
            Log out
          </button>
        </form>

        <button
          type="button"
          onClick={() => router.back()}
          className="cursor-pointer w-full border border-gray-600 text-white font-bold py-3 rounded-full hover:bg-zinc-900 active:bg-zinc-800 mt-3 transition select-none"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
