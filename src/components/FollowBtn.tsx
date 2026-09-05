"use client";

import { useTransition } from "react";
import { toggleFollow } from "@/app/actions/follow";
import { MoreHorizontal, Mail, Bell, BellPlus } from "lucide-react";

type FollowButtonProps = {
  currentUserId: string;
  targetUserId: string;
  isFollowing: boolean;
};

export default function FollowButton({
  currentUserId,
  targetUserId,
  isFollowing,
}: FollowButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleFollow = () => {
    startTransition(async () => {
      await toggleFollow(currentUserId, targetUserId);
    });
  };

  return (
    <div className="flex items-center gap-2 mb-2">
      {/* 3 Dots Icon (Placeholder) */}
      <button className="border border-gray-600 p-2 rounded-full hover:bg-zinc-900 text-white cursor-pointer transition">
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {/* Direct Message Icon (Placeholder) */}
      <button className="border border-gray-600 p-2 rounded-full hover:bg-zinc-900 text-white cursor-pointer transition">
        <Mail className="w-4 h-4" />
      </button>

      {/* Bell Icon (Shown only when following) */}
      {isFollowing && (
        <button className="border border-gray-600 p-2 rounded-full hover:bg-zinc-900 text-white cursor-pointer transition">
          <Bell className="w-4 h-4" />
        </button>
      )}

      {/* Functional Follow / Following Button */}
      <button
        onClick={handleFollow}
        disabled={isPending}
        className={`rounded-full px-4 py-1.5 text-xs font-bold cursor-pointer transition ${
          isFollowing
            ? "border border-gray-600 bg-black text-white hover:border-red-600 hover:text-red-600 hover:bg-red-900/10"
            : "bg-white text-black hover:bg-gray-200"
        }`}
      >
        {isFollowing ? "Following" : "Follow"}
      </button>
    </div>
  );
}
