"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface CommentState {
  error?: string;
  success?: boolean;
}

export async function createComment(
  prevState: CommentState,
  formData: FormData,
): Promise<CommentState> {
  const content = formData.get("content") as string;
  const postId = formData.get("postId") as string;
  const authorId = formData.get("authorId") as string;
  const parentId = (formData.get("parentId") as string) || null;

  if (!content || !content.trim()) {
    return { error: "Comment cannot be empty." };
  }

  let finalParentId = parentId;

  if (finalParentId) {
    const parentComment = await prisma.comment.findUnique({
      where: { id: finalParentId },
      select: { parentId: true },
    });

    if (parentComment?.parentId) {
      finalParentId = parentComment.parentId;
    }
  }

  try {
    await prisma.comment.create({
      data: {
        content,
        postId,
        authorId,
        parentId: finalParentId,
      },
    });

    revalidatePath("/");
    revalidatePath(`/posts/${postId}`);
    return { success: true };
  } catch (e) {
    console.log(e);
    return { error: "Failed to post comment. Please try again." };
  }
}
