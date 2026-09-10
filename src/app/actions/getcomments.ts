import { prisma } from "@/lib/prisma";

export async function getCommentsForTweet(postId: string) {
  return await prisma.comment.findMany({
    where: {
      postId: postId,
      parentId: null,
    },
    include: {
      replies: true,
    },
  });
}
