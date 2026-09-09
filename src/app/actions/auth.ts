"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function logout() {
  const cookieStore = await cookies();
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
  } catch (error) {}
  cookieStore.delete("better-auth.session_token");
  cookieStore.delete("__Secure-better-auth.session_token");
  cookieStore.delete("userId");

  redirect("/login");
}
