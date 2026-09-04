import Link from "next/link";
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
    <aside className="w-16 xl:w-64 h-screen sticky top-0 bg-black border-r border-gray-800 shrink-0 xl:p-4 flex flex-col justify-between text-white">
      <div className="flex flex-col items-center xl:items-start">
        <Link
          href="/dashboard"
          className="hover:bg-zinc-900 rounded-full w-fit transition flex items-center justify-center mb-3 ml-3"
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
          {/*change size 1440p cz lap diff */}
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-4 p-3 hover:bg-zinc-900 rounded-full w-fit transition text-xl"
              >
                <Icon className="w-6 h-6 shrink-0" />
                <span className="hidden xl:inline text-lg">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <button className="mt-4 bg-white cursor-pointer text-black font-bold py-3 xl:py-3 px-8 rounded-full w-full hidden xl:block hover:bg-opacity-90 transition">
          Post
        </button>
      </div>
    </aside>
  );
}
