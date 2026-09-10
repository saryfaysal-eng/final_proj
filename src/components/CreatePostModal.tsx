"use client";

import { useState, useActionState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, Image as ImageIcon, Feather } from "lucide-react";
import { createPostAction, PostFormState } from "@/app/actions/post";
import { UploadButton } from "@/lib/uploadthing";

interface CreatePostModalProps {
  currentUser: {
    id: string;
    name?: string | null;
    username?: string | null;
    image?: string | null;
  };
}

const initialState: PostFormState = {};

export default function CreatePostModal({ currentUser }: CreatePostModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [state, formAction, isPending] = useActionState(
    createPostAction,
    initialState,
  );

  const maxLength = 280;
  const remainingChars = maxLength - content.length;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOpen = () => setIsOpen(true);

  const handleClose = () => {
    setIsOpen(false);
    setContent("");
    setMediaUrl(null);
  };

  useEffect(() => {
    if (state.success) {
      handleClose();
    }
  }, [state.success]);

  return (
    <>
      <button
        onClick={handleOpen}
        className="bg-white hover:bg-white/90 text-black font-bold py-3 px-8 rounded-full w-full hidden xl:block transition mt-4 cursor-pointer"
      >
        Post
      </button>

      <button
        onClick={handleOpen}
        className="bg-sky-500 hover:bg-sky-600 text-white p-3 rounded-full xl:hidden flex items-center justify-center transition mt-4 cursor-pointer mx-auto"
        aria-label="Post"
      >
        <Feather className="w-6 h-6" />
      </button>

      {isOpen &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-9999 flex items-start justify-center pt-12 sm:pt-20 bg-sky-950/20 backdrop-blur-xs px-4">
            <div className="fixed inset-0" onClick={handleClose} />

            <div className="relative w-full max-w-xl bg-[#242d34] rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col border border-zinc-700/50">
              <div className="flex items-center justify-start px-3 py-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="p-2 rounded-full hover:bg-white/10 transition text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                action={formAction}
                className="px-4 pb-4 flex flex-col gap-3"
              >
                <input type="hidden" name="mediaUrl" value={mediaUrl || ""} />

                <div className="flex gap-3 pt-1">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-zinc-700 shrink-0">
                    {currentUser?.image ? (
                      <Image
                        src={currentUser.image}
                        alt={
                          currentUser.name || currentUser.username || "Avatar"
                        }
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-gray-200 text-sm">
                        {(
                          currentUser?.name?.[0] ||
                          currentUser?.username?.[0] ||
                          "U"
                        ).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col pt-1">
                    <textarea
                      ref={textareaRef}
                      name="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      maxLength={maxLength}
                      placeholder="What is happening?!"
                      rows={4}
                      className="w-full bg-transparent text-white placeholder-zinc-400 text-lg resize-none focus:outline-none border-none p-0"
                      disabled={isPending}
                      autoFocus
                    />

                    {mediaUrl && (
                      <div className="relative w-full h-48 mt-2 rounded-xl overflow-hidden border border-zinc-700 bg-zinc-800">
                        <button
                          type="button"
                          onClick={() => setMediaUrl(null)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-black text-white z-10 transition cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <Image
                          src={mediaUrl}
                          alt="Attachment preview"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                  </div>
                </div>

                {state?.error && (
                  <p className="text-xs text-red-400 px-1">{state.error}</p>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-zinc-700/60">
                  <div className="flex items-center">
                    {!mediaUrl && (
                      <UploadButton
                        endpoint="postMedia"
                        onClientUploadComplete={(res) => {
                          if (res?.[0]) setMediaUrl(res[0].ufsUrl);
                        }}
                        appearance={{
                          button:
                            "bg-transparent text-sky-400 hover:bg-sky-500/10 p-2 rounded-full cursor-pointer transition flex items-center justify-center h-auto w-auto min-w-0 border-none shadow-none focus-within:ring-0",
                          allowedContent: "hidden",
                        }}
                        content={{
                          button({ ready }) {
                            return ready ? (
                              <ImageIcon className="w-5 h-5" />
                            ) : (
                              "..."
                            );
                          },
                        }}
                      />
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs ${
                        remainingChars < 20 ? "text-red-400" : "text-zinc-400"
                      }`}
                    >
                      {remainingChars}
                    </span>
                    <button
                      type="submit"
                      disabled={
                        isPending ||
                        (!content.trim() && !mediaUrl) ||
                        remainingChars < 0
                      }
                      className="bg-zinc-200 hover:bg-white text-black font-bold px-5 py-1.5 rounded-full text-sm disabled:opacity-50 transition cursor-pointer"
                    >
                      {isPending ? "Posting..." : "Post"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
