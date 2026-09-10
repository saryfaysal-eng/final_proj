"use client";

import { useOptimistic, useTransition } from "react";
import { togglePostLike, toggleCommentLike } from "@/app/actions/likes";

interface LikeButtonProps {
  targetId: string;
  userId: string;
  initialLikesCount: number;
  initialHasLiked: boolean;
  type: "post" | "comment";
  size?: "sm" | "md";
}

export default function LikeButton({
  targetId,
  userId,
  initialLikesCount,
  initialHasLiked,
  type,
  size = "md",
}: LikeButtonProps) {
  const [isPending, startTransition] = useTransition();

  const [optimisticLike, addOptimisticLike] = useOptimistic(
    { hasLiked: initialHasLiked, count: initialLikesCount },
    (state) => ({
      hasLiked: !state.hasLiked,
      count: state.hasLiked ? state.count - 1 : state.count + 1,
    }),
  );

  const handleToggleLike = () => {
    startTransition(async () => {
      addOptimisticLike(undefined);

      if (type === "post") {
        await togglePostLike(targetId, userId);
      } else {
        await toggleCommentLike(targetId, userId);
      }
    });
  };

  const iconClass = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  return (
    <button
      onClick={handleToggleLike}
      disabled={isPending}
      className={`flex items-center gap-1.5 transition-colors group ${
        optimisticLike.hasLiked
          ? "text-pink-600"
          : "text-zinc-500 hover:text-pink-600"
      }`}
    >
      <div
        className={`p-2 rounded-full transition-colors ${
          optimisticLike.hasLiked ? "" : "group-hover:bg-pink-500/10"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          className={`${iconClass} ${
            optimisticLike.hasLiked
              ? "fill-current"
              : "fill-none stroke-current stroke-2"
          }`}
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>
      <span className={size === "sm" ? "text-[11px]" : "text-xs"}>
        {optimisticLike.count > 0 ? optimisticLike.count : ""}
      </span>
    </button>
  );
}
