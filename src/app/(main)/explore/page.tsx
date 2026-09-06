import { prisma } from "@/lib/prisma";
import SearchInput from "@/components/SearchInput";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
export const metadata: Metadata = {
  title: "Explore / X",
};

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function ExplorePage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";

  const users = query.trim()
    ? await prisma.user.findMany({
        where: {
          OR: [
            { username: { contains: query, mode: "insensitive" } },
            { name: { contains: query, mode: "insensitive" } },
          ],
        },
        take: 20,
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      })
    : [];

  return (
    <div className="flex justify-center min-h-screen bg-black text-white">
      <div className="w-16 xl:w-64 shrink-0">
        <Sidebar />
      </div>

      <main className="w-full max-w-150 border-x border-gray-800 min-h-screen">
        <SearchInput />

        <div>
          {!query.trim() ? (
            <div className="p-8 text-center text-gray-500 text-sm select-none">
              Type a username to search for accounts.
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm select-none">
              No accounts found for "{query}"
            </div>
          ) : (
            users.map((user) => (
              <Link
                key={user.id}
                href={`/${user.username}`}
                className="flex items-center gap-3 p-4 hover:bg-white/5 transition"
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-700 shrink-0">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || user.username}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-gray-300">
                      {(user.name?.[0] || user.username[0]).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-white truncate">
                    {user.name || user.username}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    @{user.username}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
