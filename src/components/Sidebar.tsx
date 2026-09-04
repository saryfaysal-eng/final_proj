import Link from "next/link";
import { logout } from "@/app/actions/auth";

import {
  Home,
  Search,
  Bell,
  UserPlus,
  MessageSquare,
  Slash,
  Bookmark,
  Zap,
  CheckCircle,
  User,
  MoreHorizontal,
} from "lucide-react";

const navItems = [
  { name: "Home", icon: Home, href: "" },
  { name: "Explore", icon: Search, href: "" },
  { name: "Notifications", icon: Bell, href: "" },
  { name: "Follow", icon: UserPlus, href: "" },
  { name: "Chat", icon: MessageSquare, href: "" },
  { name: "Grok", icon: Slash, href: "" },
  { name: "History", icon: Bookmark, href: "" },
  { name: "Creator Studio", icon: Zap, href: "" },
  { name: "Premium", icon: CheckCircle, href: "" },
  { name: "Profile", icon: User, href: "" },
  { name: "More", icon: MoreHorizontal, href: "" },
];

export default function Sidebar() {
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
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-4 px-3 py-2.5 hover:bg-zinc-900 rounded-full w-fit transition text-xl"
              >
                <Icon className="w-6 h-6 shrink-0" />
                <span className="hidden xl:inline text-base">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-3 pb-2">
        <button className="bg-white cursor-pointer text-black font-bold py-3 px-8 rounded-full w-full hidden xl:block hover:bg-white/90 transition">
          Post
        </button>
        <form action={logout}>
          <button
            type="submit"
            className="text-red-400 font-semibold text-sm hover:underline cursor-pointer px-3"
          >
            Log out
          </button>
        </form>
      </div>
    </aside>
  );
}
