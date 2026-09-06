import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const currentUser = session?.user;

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
