import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { BadgeCheck, ArrowLeft, Calendar } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import FollowButton from "@/components/FollowBtn";
import SetUpProfWrapper from "@/components/SetUpProfWrapper";
import Verification from "@/components/Verifiication";
import ProfileTabs from "@/components/ProfileTabs";
import { PostFeed } from "@/components/post-feed";

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

  if (!user) return { title: "User Not Found / X" };

  return {
    title: `Posts with replies by ${user.name} (@${user.username}) / X`,
  };
}

export default async function ProfileRepliesPage({ params }: Props) {
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
      email: true,
      emailVerified: true,
      bio: true,
      image: true,
      coverImage: true,
      createdAt: true,
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true,
        },
      },
      followers: currentUserId
        ? {
            where: { followerId: currentUserId },
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

  const postsWithUserReplies = await prisma.post.findMany({
    where: {
      comments: {
        some: {
          authorId: profileUser.id,
        },
      },
    },
    take: 50,
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          emailVerified: true,
        },
      },
      _count: {
        select: { likes: true, comments: true },
      },
      likes: currentUserId
        ? {
            where: { userId: currentUserId },
            select: { userId: true },
          }
        : false,
      comments: {
        where: { parentId: null },
        orderBy: { createdAt: "asc" },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
              emailVerified: true,
            },
          },
          _count: { select: { likes: true } },
          likes: currentUserId
            ? {
                where: { userId: currentUserId },
                select: { userId: true },
              }
            : false,
          replies: {
            orderBy: { createdAt: "asc" },
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  image: true,
                  emailVerified: true,
                },
              },
              _count: { select: { likes: true } },
              likes: currentUserId
                ? {
                    where: { userId: currentUserId },
                    select: { userId: true },
                  }
                : false,
            },
          },
        },
      },
    },
  });

  const formattedPosts = postsWithUserReplies.map((post) => ({
    ...post,
    hasLiked: Array.isArray(post.likes) && post.likes.length > 0,
    comments: (post.comments || []).map((comment) => ({
      ...comment,
      hasLiked: Array.isArray(comment.likes) && comment.likes.length > 0,
      replies: (comment.replies || []).map((reply) => ({
        ...reply,
        hasLiked: Array.isArray(reply.likes) && reply.likes.length > 0,
      })),
    })),
  }));

  return (
    <div className="h-screen overflow-hidden bg-black text-white flex justify-center">
      <div className="flex w-full max-w-7xl justify-center relative h-full">
        <div className="flex justify-end w-full max-w-22 xl:max-w-68.75 h-screen sticky top-0 shrink-0">
          <Sidebar />
        </div>

        <main className="w-full max-w-122 border-x border-gray-800 h-screen overflow-y-auto shrink-0 mr-8 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-center gap-8 px-4 py-2 sticky top-0 bg-black/80 backdrop-blur-md z-10 border-b border-gray-800">
            <Link
              href="/home"
              className="text-sm cursor-pointer p-2 hover:bg-zinc-800 rounded-full transition"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <div>
              <h1 className="text-[22px] text-gray-50 font-semibold flex items-center gap-1">
                {profileUser.name}
                {profileUser.emailVerified && (
                  <BadgeCheck className="w-5 h-5 text-white fill-sky-500 shrink-0" />
                )}
              </h1>
              <p className="text-gray-500 text-[13px]">
                {profileUser._count.posts}{" "}
                {profileUser._count.posts === 1 ? "post" : "posts"}
              </p>
            </div>
          </div>

          <div className="w-full h-40 bg-gray-600 relative">
            {profileUser.coverImage && (
              <Image
                src={profileUser.coverImage}
                alt="Banner"
                fill
                priority
                className="object-cover"
              />
            )}
          </div>

          <div className="px-4">
            <div className="flex justify-between items-end">
              <div className="w-30 h-30 rounded-full border-4 border-black -mt-16 relative bg-zinc-800 overflow-hidden flex items-center justify-center shrink-0">
                {profileUser.image ? (
                  <Image
                    src={profileUser.image}
                    alt={profileUser.name || "Avatar"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-4xl">👤</span>
                )}
              </div>

              <div className="mt-3">
                {isOwner ? (
                  <SetUpProfWrapper initialData={profileUser} />
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
          </div>

          <div className="px-4 mt-3">
            <div className="flex items-center gap-1">
              <h1 className="text-xl font-bold">{profileUser.name}</h1>
              {profileUser.emailVerified ? (
                <BadgeCheck className="w-5 h-5 text-white fill-sky-500 shrink-0" />
              ) : (
                isOwner && (
                  <Verification
                    userId={profileUser.id}
                    email={profileUser.email}
                    username={profileUser.username}
                  />
                )
              )}
            </div>
            <p className="text-gray-500 text-[15px]">@{profileUser.username}</p>

            {profileUser.bio && (
              <p className="mt-3 text-[15px] text-gray-100 whitespace-pre-wrap leading-tight">
                {profileUser.bio}
              </p>
            )}
          </div>

          <div className="px-4 mt-3 flex items-center gap-1.5 text-gray-500">
            <Calendar className="w-4 h-4" />
            <span className="text-[15px]">
              Joined{" "}
              {new Date(profileUser.createdAt).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="px-4 mt-3 flex items-center gap-4 text-gray-500 text-[15px]">
            <Link
              href={`/${profileUser.username}/following`}
              className="hover:underline flex items-center gap-1"
            >
              <span className="font-bold text-white">
                {profileUser._count.following}
              </span>{" "}
              Following
            </Link>
            <Link
              href={`/${profileUser.username}/followers`}
              className="hover:underline flex items-center gap-1"
            >
              <span className="font-bold text-white">
                {profileUser._count.followers}
              </span>{" "}
              Followers
            </Link>
          </div>

          <ProfileTabs username={profileUser.username} />

          <div className="min-h-screen">
            {session?.user ? (
              <PostFeed
                initialPosts={formattedPosts}
                currentUser={session.user}
                hideCreatePost={true}
              />
            ) : (
              <p className="text-center text-zinc-500 text-[15px] mt-8">
                Sign in to interact with posts.
              </p>
            )}
          </div>
        </main>

        <div className="hidden lg:block w-full max-w-87.5 shrink-0 h-screen sticky top-0" />
      </div>
    </div>
  );
}
