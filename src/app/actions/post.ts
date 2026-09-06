"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export type PostFormState = {
  error?: string;
  success?: boolean;
};

export async function createPostAction(
  prevState: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { error: "You must be signed in to post." };
  }

  const content = (formData.get("content") as string) || "";
  const mediaUrl = (formData.get("mediaUrl") as string) || "";

  if (!content.trim() && !mediaUrl) {
    return { error: "Please enter text or upload media." };
  }

  try {
    await prisma.post.create({
      data: {
        content,
        mediaUrl: mediaUrl || null,
        authorId: session.user.id,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error("Failed to create post:", err);
    return { error: "Something went wrong while creating your post." };
  }
}
