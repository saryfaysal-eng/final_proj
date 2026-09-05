"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. Follow / Unfollow a User
export async function toggleFollow(
  currentUserId: string,
  targetUserId: string,
) {
  if (currentUserId === targetUserId) {
    throw new Error("You cannot follow yourself");
  }

  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: currentUserId,
        followingId: targetUserId,
      },
    },
  });

  if (existingFollow) {
    // Unfollow
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: targetUserId,
        },
      },
    });
  } else {
    // Follow
    await prisma.follow.create({
      data: {
        followerId: currentUserId,
        followingId: targetUserId,
      },
    });
  }

  revalidatePath(`/${targetUserId}`);
}

// 2. Fetch Profile Info + Counts + IsFollowing Status
export async function getUserProfile(
  targetUsername: string,
  currentUserId?: string,
) {
  const user = await prisma.user.findUnique({
    where: { username: targetUsername },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      createdAt: true,
      _count: {
        select: {
          followers: true, // Followers count
          following: true, // Following count
        },
      },
      // Check if current user is following this profile
      followers: currentUserId
        ? {
            where: {
              followerId: currentUserId,
            },
          }
        : false,
    },
  });

  if (!user) return null;

  return {
    ...user,
    isFollowing: user.followers ? user.followers.length > 0 : false,
  };
}
