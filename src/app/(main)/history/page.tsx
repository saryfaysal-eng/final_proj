import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import { PostFeed } from "@/components/post-feed";

export const metadata: Metadata = {
  title: "History / X",
};

export default async function HistoryPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const currentUserId = session.user.id;

  const likedPosts = await prisma.post.findMany({
    where: {
      likes: {
        some: {
          userId: currentUserId,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { id: true, name: true, username: true, image: true },
      },
      _count: {
        select: { likes: true, comments: true },
      },
      likes: {
        where: { userId: currentUserId },
        select: { userId: true },
      },
      comments: {
        where: { parentId: null },
        orderBy: { createdAt: "asc" },
        include: {
          author: {
            select: { id: true, name: true, username: true, image: true },
          },
          _count: { select: { likes: true } },
          likes: {
            where: { userId: currentUserId },
            select: { userId: true },
          },
          replies: {
            orderBy: { createdAt: "asc" },
            include: {
              author: {
                select: { id: true, name: true, username: true, image: true },
              },
              _count: { select: { likes: true } },
              likes: {
                where: { userId: currentUserId },
                select: { userId: true },
              },
            },
          },
        },
      },
    },
  });

  const formattedPosts = likedPosts.map((post) => ({
    ...post,
    hasLiked: Array.isArray(post.likes) && post.likes.length > 0,
    comments: post.comments.map((comment) => ({
      ...comment,
      hasLiked: Array.isArray(comment.likes) && comment.likes.length > 0,
      replies: comment.replies.map((reply) => ({
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
          <div className="sticky top-0 z-20 bg-black/60 backdrop-blur-md border-b border-gray-800">
            <div className="flex items-center justify-between px-4 pt-3 pb-2">
              <div className="flex items-center gap-6">
                <Link
                  href="/home"
                  className="text-sm cursor-pointer hover:opacity-80 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m12 19-7-7 7-7" />
                    <path d="M19 12H5" />
                  </svg>
                </Link>
                <h1 className="text-xl font-bold text-gray-50">History</h1>
              </div>
            </div>
            <div className="flex">
              <div className="flex-1 flex justify-center hover:bg-white/5 transition cursor-pointer">
                <div className="py-3 px-4 font-semibold text-sm text-white border-b-4 border-sky-500 flex items-center gap-2">
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
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                  Likes
                </div>
              </div>
            </div>
          </div>

          <div className="min-h-screen">
            {formattedPosts.length > 0 ? (
              <PostFeed
                initialPosts={formattedPosts}
                currentUser={session.user}
                hideCreatePost={true}
              />
            ) : (
              <div className="text-center text-zinc-500 text-sm py-12">
                You haven&apos;t liked any posts yet.
              </div>
            )}
          </div>
        </main>

        <div className="hidden lg:block w-full max-w-87.5 shrink-0 h-screen sticky top-0" />
      </div>
    </div>
  );
}
