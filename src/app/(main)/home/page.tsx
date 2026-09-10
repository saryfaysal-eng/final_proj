import Sidebar from "@/components/Sidebar";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { PostFeed } from "@/components/post-feed";
import { Suspense } from "react";
import SearchInput from "@/components/SearchInput";

export const metadata: Metadata = {
  title: "Home / X",
};

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return <div>Please sign in to view the feed.</div>;

  const following = await prisma.follow.findMany({
    where: {
      followerId: session.user.id,
    },
    select: {
      followingId: true,
    },
  });

  const followingIds = following.map((f) => f.followingId);
  const feedUserIds = [...followingIds, session.user.id];

  const posts = await prisma.post.findMany({
    where: {
      authorId: {
        in: feedUserIds,
      },
    },
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
      likes: {
        where: { userId: session.user.id },
        select: { userId: true },
      },
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
          likes: {
            where: { userId: session.user.id },
            select: { userId: true },
          },
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
              likes: {
                where: { userId: session.user.id },
                select: { userId: true },
              },
            },
          },
        },
      },
    },
  });

  const formattedPosts = posts.map((post) => ({
    ...post,
    hasLiked: post.likes.length > 0,
    comments: post.comments.map((comment) => ({
      ...comment,
      hasLiked: comment.likes.length > 0,
      replies: comment.replies.map((reply) => ({
        ...reply,
        hasLiked: reply.likes.length > 0,
      })),
    })),
  }));

  return (
    <div className="h-screen overflow-hidden bg-black text-white flex justify-center">
      <div className="flex h-full">
        <div className="w-22 xl:w-68.75 h-screen sticky top-0 shrink-0 flex justify-end">
          <Sidebar />
        </div>

        <main className="w-150 border-x border-gray-800 h-screen overflow-y-auto shrink-0 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="sticky top-0 bg-black/80 backdrop-blur-md z-10 border-b border-gray-800 flex items-center h-13 font-bold text-sm">
            <button className="flex-1 h-full flex items-center justify-center hover:bg-zinc-900/60 transition">
              <span className="relative h-full flex items-center border-b-4 border-sky-500 font-bold">
                Following
              </span>
            </button>
          </div>

          <div className="min-h-screen p-4">
            <PostFeed
              initialPosts={formattedPosts}
              currentUser={session.user}
            />
          </div>
        </main>

        <div className="hidden lg:block w-22 xl:w-68.75 h-screen sticky top-0 shrink-0 p-4">
          <Suspense
            fallback={
              <div className="w-full h-14 bg-zinc-900 rounded-full animate-pulse" />
            }
          >
            <SearchInput />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
