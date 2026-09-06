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
};

interface CreatePostFormProps {
  currentUser: CurrentUser;
  addOptimisticPost: (post: PostWithAuthor) => void;
}

export function CreatePostForm({
  currentUser,
  addOptimisticPost,
}: CreatePostFormProps) {
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);

  const handleFormSubmit = async (formData: FormData) => {
    const rawContent = (formData.get("content") as string) || "";
    const rawMediaUrl = (formData.get("mediaUrl") as string) || "";

    if (!rawContent.trim() && !rawMediaUrl) return;

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
      },
      _count: { likes: 0, comments: 0 },
    });

    setContent("");
    setMediaUrl(null);

    await createPostAction({}, formData);
  };

  return (
    <form action={handleFormSubmit} className="p-4 space-y-3">
      <textarea
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What is happening?!"
        className="w-full resize-none outline-none text-lg bg-transparent"
        rows={3}
      />

      <input type="hidden" name="mediaUrl" value={mediaUrl || ""} />

      {mediaUrl && (
        <div className="relative rounded-2xl overflow-hidden max-h-80 border">
          <button
            type="button"
            onClick={() => setMediaUrl(null)}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-black text-white"
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

      <div className="flex items-center justify-between pt-2 border-t">
        {!mediaUrl && (
          <UploadButton
            endpoint="postMedia"
            onClientUploadComplete={(res) => {
              if (res?.[0]) setMediaUrl(res[0].ufsUrl);
            }}
            appearance={{
              button:
                "bg-transparent text-sky-500 hover:bg-sky-500/10 p-2 rounded-full",
              allowedContent: "hidden",
            }}
            content={{
              button({ ready }) {
                return ready ? <ImageIcon className="w-5 h-5" /> : "Loading...";
              },
            }}
          />
        )}

        <button
          type="submit"
          disabled={!content.trim() && !mediaUrl}
          className="bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-bold px-4 py-1.5 rounded-full text-sm"
        >
          Post
        </button>
      </div>
    </form>
  );
}
