import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import Image from "next/image";

import {
  Home,
  Search,
  Bell, //Me when taco bell:
  Bookmark,
  User,
  MoreHorizontal,
} from "lucide-react";

export default async function Sidebar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const currentUser = session?.user;
  const profileHref = currentUser?.username
    ? `/${currentUser.username}`
    : "/login";

  const navItems = [
    { name: "Home", icon: Home, href: "/home" },
    { name: "Explore", icon: Search, href: "/explore" },
    { name: "Notifications", icon: Bell, href: "" },
    { name: "History", icon: Bookmark, href: "" },
    { name: "Profile", icon: User, href: profileHref },
    { name: "More", icon: MoreHorizontal, href: "" },
  ];

  return (
    <aside className="w-16 xl:w-64 h-screen sticky top-0 bg-black border-r border-gray-800 shrink-0 p-3 xl:p-4 flex flex-col justify-between text-white">
      <div className="flex flex-col items-center xl:items-start">
        <Link
          href="/dashboard"
          className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-zinc-900 transition mb-1"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="w-6 h-6 fill-white"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </Link>
        <nav className="w-full space-y-1">
          {" "}
          {/*change size 1440p cz lap built/biult diff */}
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-4 hover:px-3 py-2.5 hover:bg-zinc-900 rounded-full w-fit transition-all text-xl ml-3"
              >
                <Icon className="w-6 h-6 shrink-0" />
                <span className="hidden xl:inline text-base">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <button className="bg-white cursor-pointer text-black font-bold py-3 px-8 rounded-full w-full hidden xl:block hover:bg-white/90 transition mt-4">
          Post
        </button>
      </div>

      <div className="flex flex-col gap-3 pb-2 w-full">
        {currentUser ? (
          <details className="relative group w-full">
            <summary className="flex items-center justify-between p-3 rounded-full hover:bg-zinc-900 cursor-pointer list-none transition w-full">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-700 shrink-0">
                  {currentUser.image ? (
                    <Image
                      src={currentUser.image}
                      alt={currentUser.name || currentUser.username}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-gray-300">
                      {(
                        currentUser.name?.[0] || currentUser.username[0]
                      ).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="hidden xl:flex flex-col min-w-0 text-left">
                  <p className="font-bold text-sm text-white truncate">
                    {currentUser.name || currentUser.username}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    @{currentUser.username}
                  </p>
                </div>
              </div>
              <MoreHorizontal className="w-5 h-5 text-gray-500 hidden xl:block shrink-0" />
            </summary>

            <div className="absolute bottom-full mb-3 left-0 w-60 bg-black border border-gray-800 rounded-2xl shadow-2xl z-50">
              <Link
                href="/logout"
                className="w-full text-left px-4 py-3 hover:bg-zinc-900 active:bg-zinc-800 rounded-2xl text-sm text-white font-semibold transition cursor-pointer block"
              >
                Log out @{currentUser.username}
              </Link>
            </div>
          </details>
        ) : (
          <Link
            href="/login"
            className="text-white font-semibold text-sm hover:underline cursor-pointer px-3"
          >
            Log in
          </Link>
        )}
      </div>
    </aside>
  );
}
