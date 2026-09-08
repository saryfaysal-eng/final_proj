"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function verifyUserEmail(userId: string, username: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { emailVerified: true },
  });

  revalidatePath(`/${username}`);
  return { success: true };
}
