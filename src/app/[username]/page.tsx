import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import FollowButton from "@/components/FollowBtn";
import Link from "next/link";
import { Metadata } from "next";

type Props = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const cleanUsername = decodeURIComponent(username)
    .replace(/^@/, "")
    .toLowerCase();

  const user = await prisma.user.findUnique({
    where: { username: cleanUsername },
    select: { name: true, username: true },
  });

  if (!user) {
    return { title: "User Not Found / X" };
  }

  return {
    title: `${user.name} (@${user.username}) / X`,
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const cleanUsername = decodeURIComponent(username)
    .replace(/^@/, "")
    .toLowerCase();

  // Retrieve authenticated user ID securely via Better Auth
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
      createdAt: true,
      _count: {
        select: {
          followers: true,
          following: true,
        },
      },
      followers: currentUserId
        ? {
            where: {
              followerId: currentUserId,
            },
          }
        : false,
    },
  });

  if (!profileUser) {
    notFound();
  }

  const isOwner = currentUserId === profileUser.id;
  const isFollowing = profileUser.followers
    ? profileUser.followers.length > 0
    : false;

  return (
    <div className="h-screen overflow-hidden bg-black text-white flex justify-center">
      <div className="flex w-full max-w-7xl justify-center relative h-full">
        <div className="flex justify-end w-full max-w-22 xl:max-w-68.75 h-screen sticky top-0 shrink-0">
          <Sidebar />
        </div>
        <main className="w-full max-w-122 border-x border-gray-800 h-screen overflow-y-auto shrink-0 mr-8 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-center gap-8 px-4 py-2 sticky top-0 bg-black/80 backdrop-blur-md z-10 border-b border-gray-800">
            <div className="text-sm cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-left-icon lucide-arrow-left"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
            </div>
            <div>
              <h1 className="text-[22px] text-gray-50 font-semibold">
                {profileUser.name}
              </h1>
              <p className="text-gray-500 text-[10px]">Post number</p>
            </div>
          </div>

          <div className="w-full h-40 bg-gray-600"></div>

          <div className="px-4">
            <div className="flex justify-between items-end">
              <div className="w-30 h-30 rounded-full bg-green-500 border-4 border-black -mt-16 relative" />

              {isOwner ? (
                <button className="border border-gray-600 rounded-full px-4 py-1.5 text-xs font-semibold text-white mb-2 cursor-pointer hover:bg-zinc-900 transition">
                  Set up profile
                </button>
              ) : (
                currentUserId && (
                  <FollowButton
                    currentUserId={currentUserId}
                    targetUserId={profileUser.id}
                    isFollowing={isFollowing}
                  />
                )
              )}
            </div>
          </div>
          <div className="px-4 mt-2">
            <h1 className="text-lg font-bold">{profileUser.name}</h1>
            <p className="text-gray-500 text-xs">@{profileUser.username}</p>
          </div>
          <div className="px-4 mt-2 flex items-center gap-1 text-gray-500">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-calendar-days-icon lucide-calendar-days"
              >
                <path d="M8 2v3" />
                <path d="M16 2v3" />
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18" />
                <path d="M8 13h.01" />
                <path d="M12 13h.01" />
                <path d="M16 13h.01" />
                <path d="M8 17h.01" />
                <path d="M12 17h.01" />
                <path d="M16 17h.01" />
              </svg>
            </span>
            <p className="text-xs">
              Joined{" "}
              {new Date(profileUser.createdAt).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="px-4 mt-2 flex items-center gap-4 text-gray-500 text-xs">
            <p>
              <span className="font-bold text-white">
                {profileUser._count.following}
              </span>{" "}
              Following
            </p>
            <p>
              <span className="font-bold text-white">
                {profileUser._count.followers}
              </span>{" "}
              Followers
            </p>
          </div>
          <Link
            href={"/dashboard"}
            className="text-green-500 flex justify-end items-end text-sm m-10 mr-4 hover:underline"
          >
            Back to dashboard Screen?
          </Link>
        </main>

        <div className="hidden lg:block w-full max-w-87.5 shrink-0 h-screen sticky top-0" />
      </div>
    </div>
  );
}
