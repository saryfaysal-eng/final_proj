"use client";

import { useState } from "react";
import { UploadButton } from "@/lib/uploadthing";
import { createPostAction } from "@/app/actions/post";
import type { PostWithAuthor } from "@/types/post";
import { Image as ImageIcon, X } from "lucide-react";

export type CurrentUser = {
  id: string;
  name?: string | null;
  username?: string | null;
  image?: string | null;
  emailVerified?: boolean;
};

interface CreatePostFormProps {
  currentUser: CurrentUser;
  addOptimisticPost: (post: PostWithAuthor) => void;
}

const MAX_CHARS = 280;

export function CreatePostForm({
  currentUser,
  addOptimisticPost,
}: CreatePostFormProps) {
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);

  const charCount = content.length;
  const isNearLimit = charCount >= MAX_CHARS - 20;
  const isAtLimit = charCount >= MAX_CHARS;

  const circleRadius = 10;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset =
    circleCircumference -
    (circleCircumference * Math.min(charCount, MAX_CHARS)) / MAX_CHARS;

  const handleFormSubmit = async (formData: FormData) => {
    const rawContent = (formData.get("content") as string) || "";
    const rawMediaUrl = (formData.get("mediaUrl") as string) || "";

    if ((!rawContent.trim() && !rawMediaUrl) || rawContent.length > MAX_CHARS) {
      return;
    }

    addOptimisticPost({
      id: `temp-id-${Date.now()}`,
      content: rawContent,
      mediaUrl: rawMediaUrl || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: currentUser.id,
      author: {
        id: currentUser.id,
        name: currentUser.name ?? null,
        username: currentUser.username ?? null,
        image: currentUser.image ?? null,
        emailVerified: currentUser.emailVerified ?? false,
      },
      _count: { likes: 0, comments: 0 },
      hasLiked: false,
      comments: [],
    });

    setContent("");
    setMediaUrl(null);

    await createPostAction({}, formData);
  };

  return (
    <div className="flex gap-3 px-4 pt-3 pb-2 border-b border-zinc-800">
      <div className="shrink-0">
        {currentUser.image ? (
          <img
            src={currentUser.image}
            alt={currentUser.name ?? "User"}
            className="w-10 h-10 rounded-full object-cover hover:opacity-90 transition-opacity cursor-pointer"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-zinc-700 font-bold text-white flex items-center justify-center">
            {currentUser.name?.[0]?.toUpperCase() ?? "U"}
          </div>
        )}
      </div>

      <form action={handleFormSubmit} className="flex-1 min-w-0 flex flex-col">
        <textarea
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={MAX_CHARS}
          placeholder="What is happening?!"
          className="w-full resize-none outline-none text-lg bg-transparent text-white placeholder-zinc-500 mt-1"
          rows={Math.max(1, content.split("\n").length)}
        />

        <input type="hidden" name="mediaUrl" value={mediaUrl || ""} />

        {mediaUrl && (
          <div className="relative rounded-2xl overflow-hidden mt-2 max-h-80 border border-zinc-800">
            <button
              type="button"
              onClick={() => setMediaUrl(null)}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white backdrop-blur-sm transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={mediaUrl}
              alt="Upload preview"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center -ml-2">
            {!mediaUrl && (
              <UploadButton
                endpoint="postMedia"
                onClientUploadComplete={(res) => {
                  if (res?.[0]) setMediaUrl(res[0].ufsUrl);
                }}
                appearance={{
                  container: "w-9 h-9 m-0 p-0 flex items-center justify-center",
                  button:
                    "w-9 h-9 bg-transparent border-none p-0 m-0 shadow-none hover:bg-sky-500/10 rounded-full transition-colors focus-within:ring-0 outline-none flex items-center justify-center text-[0px] text-transparent after:hidden",
                  allowedContent: "hidden opacity-0 w-0 h-0 text-[0px]",
                }}
                content={{
                  button: ({ ready }) =>
                    ready ? (
                      <ImageIcon className="w-5 h-5 text-sky-500 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-sky-500 border-t-transparent animate-spin shrink-0" />
                    ),
                }}
              />
            )}
          </div>

          <div className="flex items-center gap-4">
            {charCount > 0 && (
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-6 h-6">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 24 24"
                    className="-rotate-90"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r={circleRadius}
                      fill="none"
                      stroke="#272c30"
                      strokeWidth="2"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r={circleRadius}
                      fill="none"
                      stroke={
                        isAtLimit
                          ? "#f4212e"
                          : isNearLimit
                            ? "#ffd400"
                            : "#1d9bf0"
                      }
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray={circleCircumference}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-200 ease-out"
                    />
                  </svg>
                  {isNearLimit && (
                    <span
                      className={`absolute text-[10px] ${
                        isAtLimit ? "text-[#f4212e]" : "text-zinc-500"
                      }`}
                    >
                      {MAX_CHARS - charCount}
                    </span>
                  )}
                </div>
                <div className="w-px h-7 bg-zinc-800" />
              </div>
            )}

            <button
              type="submit"
              disabled={(!content.trim() && !mediaUrl) || isAtLimit}
              className="bg-sky-500 hover:bg-sky-600 disabled:bg-sky-500/50 disabled:text-white/50 text-white font-bold px-4 py-1.5 rounded-full text-sm transition-colors"
            >
              Post
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
