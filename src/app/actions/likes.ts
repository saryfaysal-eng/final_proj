"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function togglePostLike(postId: string, userId: string) {
  try {
    const existingLike = await prisma.postLike.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });

    if (existingLike) {
      await prisma.postLike.delete({
        where: { userId_postId: { userId, postId } },
      });
    } else {
      await prisma.postLike.create({
        data: { userId, postId },
      });
    }

    revalidatePath("/");
  } catch (error) {
    console.error("Failed to toggle post like", error);
  }
}

export async function toggleCommentLike(commentId: string, userId: string) {
  try {
    const existingLike = await prisma.commentLike.findUnique({
      where: {
        userId_commentId: { userId, commentId },
      },
    });

    if (existingLike) {
      await prisma.commentLike.delete({
        where: { userId_commentId: { userId, commentId } },
      });
    } else {
      await prisma.commentLike.create({
        data: { userId, commentId },
      });
    }

    revalidatePath("/");
  } catch (error) {
    console.error("Failed to toggle comment like.", error);
  }
}
