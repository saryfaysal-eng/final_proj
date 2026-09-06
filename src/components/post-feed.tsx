"use client";

import { useOptimistic } from "react";
import {
  CreatePostForm,
  type CurrentUser,
} from "@/components/create-post-form";
import type { PostWithAuthor } from "@/types/post";

interface PostFeedProps {
  initialPosts: PostWithAuthor[];
  currentUser: CurrentUser;
}

export function PostFeed({ initialPosts, currentUser }: PostFeedProps) {
  const [optimisticPosts, addOptimisticPost] = useOptimistic(
    initialPosts,
    (currentPosts, newPost: PostWithAuthor) => [newPost, ...currentPosts],
  );

  return (
    <div>
      <CreatePostForm
        currentUser={currentUser}
        addOptimisticPost={addOptimisticPost}
      />

      <div className="divide-y border-t mt-2">
        {optimisticPosts.map((post) => (
          <article
            key={post.id}
            className="p-4 space-y-2 opacity-90 transition-opacity"
          >
            <div className="flex items-center gap-2">
              {post.author.image && (
                <img
                  src={post.author.image}
                  alt={
                    post.author.name ?? post.author.username ?? "User avatar"
                  }
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div>
                <p className="font-bold text-sm">{post.author.name}</p>
                {post.author.username && (
                  <p className="text-gray-500 text-xs">
                    @{post.author.username}
                  </p>
                )}
              </div>
            </div>

            <p className="text-base">{post.content}</p>

            {post.mediaUrl && (
              <img
                src={post.mediaUrl}
                alt="Post attachment"
                className="rounded-2xl max-h-80 w-full object-cover border"
              />
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
