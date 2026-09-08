import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import FollowButton from "@/components/FollowBtn";

export default async function FollowingPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const cleanUsername = decodeURIComponent(username)
    .replace(/^@/, "")
    .toLowerCase();

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const currentUserId = session?.user?.id;
  const profileUser = await prisma.user.findUnique({
    where: { username: cleanUsername },
    select: {
      id: true,
      name: true,
      username: true,
      following: {
        select: {
          following: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
              bio: true,
              followers: currentUserId
                ? {
                    where: { followerId: currentUserId },
                  }
                : false,
            },
          },
        },
      },
    },
  });

  if (!profileUser) notFound();

  return (
    <div className="h-screen overflow-hidden bg-black text-white flex justify-center">
      <div className="flex w-full max-w-7xl justify-center relative h-full">
        <div className="flex justify-end w-full max-w-22 xl:max-w-68.75 h-screen sticky top-0 shrink-0">
          <Sidebar />
        </div>

        <main className="w-full max-w-122 border-x border-gray-800 h-screen overflow-y-auto shrink-0 mr-8 scrollbar-none">
          <div className="flex items-center gap-6 px-4 py-2 sticky top-0 bg-black/80 backdrop-blur-md z-10">
            <Link
              href={`/${profileUser.username}`}
              className="p-2 hover:bg-zinc-900 rounded-full transition"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </Link>
            <div>
              <h1 className="text-lg font-bold">{profileUser.name}</h1>
              <p className="text-xs text-gray-500">@{profileUser.username}</p>
            </div>
          </div>
          <div className="sticky top-13 bg-black/80 backdrop-blur-md z-10 border-b border-gray-800 flex items-center h-13 font-bold text-sm">
            <Link
              href={`/${profileUser.username}/followers`}
              className="flex-1 h-full flex items-center justify-center hover:bg-zinc-900/60 transition text-gray-500"
            >
              Followers
            </Link>
            <Link
              href={`/${profileUser.username}/following`}
              className="flex-1 h-full flex items-center justify-center hover:bg-zinc-900/60 transition text-white"
            >
              <span className="relative h-full flex items-center border-b-4 border-sky-500 font-bold">
                Following
              </span>
            </Link>
          </div>
          <div className="divide-y divide-gray-800">
            {profileUser.following.map(({ following }) => {
              const isFollowing = following.followers
                ? following.followers.length > 0
                : false;
              const isOwner = currentUserId === following.id;

              return (
                <div
                  key={following.id}
                  className="p-4 flex justify-between items-start hover:bg-zinc-950 transition"
                >
                  <div className="flex gap-3">
                    <Link
                      href={`/${following.username}`}
                      className="w-10 h-10 rounded-full overflow-hidden relative bg-zinc-800 shrink-0"
                    >
                      {following.image ? (
                        <Image
                          src={following.image}
                          alt={following.name || "Avatar"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg">
                          👤
                        </div>
                      )}
                    </Link>
                    <div>
                      <Link
                        href={`/${following.username}`}
                        className="font-bold hover:underline block leading-tight"
                      >
                        {following.name}
                      </Link>
                      <p className="text-gray-500 text-xs">
                        @{following.username}
                      </p>
                      {following.bio && (
                        <p className="text-sm mt-1 text-gray-300">
                          {following.bio}
                        </p>
                      )}
                    </div>
                  </div>

                  {!isOwner && currentUserId && (
                    <FollowButton
                      currentUserId={currentUserId}
                      targetUserId={following.id}
                      isFollowing={isFollowing}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </main>

        <div className="hidden lg:block w-full max-w-87.5 shrink-0 h-screen sticky top-0" />
      </div>
    </div>
  );
}
