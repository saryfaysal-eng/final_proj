import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const cleanUsername = decodeURIComponent(username)
    .replace(/^@/, "")
    .toLowerCase();

  const profileUser = await prisma.user.findUnique({
    where: { username: cleanUsername },
    select: {
      id: true,
      name: true,
      username: true,
      createdAt: true,
    },
  });

  if (!profileUser) {
    notFound();
  }

  const cookieStore = await cookies();
  const currentUserId = cookieStore.get("userId")?.value;
  const isOwner = currentUserId === profileUser.id;

  return (
    <div className="min-h-screen bg-black text-white flex justify-center">
      <div className="flex w-full max-w-7xl justify-center relative">
        <div className="flex justify-end w-full max-w-22 xl:max-w-68.75">
          <Sidebar />
        </div>

        <main className="w-full max-w-122 border-x border-gray-800 min-h-screen p-4 shrink-0 mr-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-xl font-bold">
                {profileUser.name || profileUser.username}
              </h1>
              <p className="text-gray-500 text-sm">@{profileUser.username}</p>
            </div>

            {isOwner && (
              <button className="border border-gray-600 hover:bg-gray-900 text-white font-bold px-4 py-1.5 rounded-full text-sm cursor-pointer">
                Edit profile
              </button>
            )}
          </div>

          <p className="text-xs text-gray-500 mt-3">
            Joined{" "}
            {new Date(profileUser.createdAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
          <Link href={"/dashboard"} className="text-green-500">
            Back to dashboard?
          </Link>
        </main>

        <div className="hidden lg:block w-full max-w-87.5 shrink-0" />
      </div>
    </div>
  );
}
