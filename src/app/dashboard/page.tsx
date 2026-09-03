import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  // Fetch logged-in user details to get their username
  const currentUser = userId
    ? await prisma.user.findUnique({ where: { id: userId } })
    : null;

  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <Link href={"/login"} className="text-blue-400 underline">
        Back to login?
      </Link>

      {currentUser ? (
        <Link
          href={`/${currentUser.username}`}
          className="border border-gray-700 bg-gray-900 px-4 py-2 rounded hover:bg-gray-800 w-fit"
        >
          Go to My Profile (@{currentUser.username})
        </Link>
      ) : (
        <p className="text-gray-400">Not logged in.</p>
      )}
    </div>
  );
}
