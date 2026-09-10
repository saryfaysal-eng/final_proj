"use client";

import { useOptimistic, useState } from "react";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import {
  CreatePostForm,
  type CurrentUser,
} from "@/components/create-post-form";
import type { PostWithAuthor } from "@/types/post";
import type { CommentWithAuthor } from "@/types/comment";
import CommentForm from "./CreateCommentForm";
import LikeButton from "./LikeButton";

function formatTimeAgo(dateInput: Date | string) {
  const date = new Date(dateInput);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `${Math.max(0, diffInSeconds)}s`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface PostFeedProps {
  initialPosts: PostWithAuthor[];
  currentUser: CurrentUser;
  hideCreatePost?: boolean;
}

export function PostFeed({
  initialPosts,
  currentUser,
  hideCreatePost = false,
}: PostFeedProps) {
  const [optimisticPosts, addOptimisticPost] = useOptimistic(
    initialPosts,
    (currentPosts, newPost: PostWithAuthor) => [newPost, ...currentPosts],
  );

  return (
    <div>
      {!hideCreatePost && (
        <CreatePostForm
          currentUser={currentUser}
          addOptimisticPost={addOptimisticPost}
        />
      )}

      <div
        className={`divide-y divide-zinc-800 ${!hideCreatePost ? "border-t border-zinc-800 mt-2" : ""}`}
      >
        {optimisticPosts.map((post) => (
          <PostItem key={post.id} post={post} currentUser={currentUser} />
        ))}
      </div>
    </div>
  );
}
function PostItem({
  post,
  currentUser,
}: {
  post: PostWithAuthor;
  currentUser: CurrentUser;
}) {
  const [showMainReplyForm, setShowMainReplyForm] = useState(false);
  const profileUrl = `/${post.author.username}`;

  return (
    <article className="p-4 hover:bg-zinc-900/30 transition-colors flex gap-3">
      <Link href={profileUrl} className="shrink-0 h-fit">
        <Avatar src={post.author.image} name={post.author.name} size="md" />
      </Link>

      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-center gap-1 text-sm overflow-hidden whitespace-nowrap">
          <Link
            href={profileUrl}
            className="font-bold text-white hover:underline truncate"
          >
            {post.author.name}
          </Link>

          {post.author.emailVerified && (
            <BadgeCheck className="w-4.5 h-4.5 text-white fill-sky-500 shrink-0" />
          )}

          {post.author.username && (
            <Link
              href={profileUrl}
              className="text-zinc-500 truncate shrink-0 hover:text-zinc-400 transition-colors"
            >
              @{post.author.username}
            </Link>
          )}

          <span className="text-zinc-500 shrink-0">·</span>

          <span className="text-zinc-500 shrink-0 hover:underline cursor-pointer">
            {formatTimeAgo(post.createdAt)}
          </span>
        </div>

        <p className="text-base text-white whitespace-pre-wrap">
          {post.content}
        </p>

        {post.mediaUrl && (
          <img
            src={post.mediaUrl}
            alt="Post attachment"
            className="rounded-2xl max-h-80 w-full object-cover border border-zinc-800 mt-2"
          />
        )}

        <div className="flex gap-6 mt-3 text-zinc-500">
          <button
            onClick={() => setShowMainReplyForm(!showMainReplyForm)}
            className="flex items-center gap-2 text-xs hover:text-sky-500 transition-colors group"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z" />
            </svg>
            <span>{post._count?.comments || 0}</span>
          </button>

          <LikeButton
            targetId={post.id}
            userId={currentUser.id}
            initialLikesCount={post._count?.likes || 0}
            initialHasLiked={post.hasLiked}
            type="post"
          />
        </div>

        {showMainReplyForm && (
          <div className="mt-2 border-l-2 border-zinc-800 pl-4">
            <CommentForm
              postId={post.id}
              authorId={currentUser.id}
              onSuccess={() => setShowMainReplyForm(false)}
            />
          </div>
        )}

        {post.comments && post.comments.length > 0 && (
          <div className="mt-2 space-y-3 border-t border-zinc-800/80 pt-3">
            {post.comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                postId={post.id}
                currentUser={currentUser}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

function CommentItem({
  comment,
  postId,
  currentUser,
}: {
  comment: CommentWithAuthor;
  postId: string;
  currentUser: CurrentUser;
}) {
  const [isReplying, setIsReplying] = useState(false);
  const profileUrl = `/${comment.author.username}`;

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center shrink-0">
        <Link href={profileUrl}>
          <Avatar
            src={comment.author.image}
            name={comment.author.name}
            size="sm"
          />
        </Link>
        {comment.replies && comment.replies.length > 0 && (
          <div className="w-0.5 grow bg-zinc-800 my-1 rounded-full" />
        )}
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-1 text-sm overflow-hidden whitespace-nowrap">
          <Link
            href={profileUrl}
            className="font-bold text-white hover:underline truncate"
          >
            {comment.author.name}
          </Link>

          {comment.author.emailVerified && (
            <BadgeCheck className="w-4 h-4 text-white fill-sky-500 shrink-0" />
          )}

          {comment.author.username && (
            <Link
              href={profileUrl}
              className="text-zinc-500 truncate shrink-0 hover:text-zinc-400 transition-colors"
            >
              @{comment.author.username}
            </Link>
          )}

          <span className="text-zinc-500 shrink-0">·</span>
          <span className="text-zinc-500 shrink-0 hover:underline cursor-pointer text-xs">
            {formatTimeAgo(comment.createdAt)}
          </span>
        </div>

        <p className="text-sm text-zinc-200 whitespace-pre-wrap">
          {comment.content}
        </p>

        <div className="flex items-center gap-4 mt-1">
          <button
            onClick={() => setIsReplying(!isReplying)}
            className="text-xs text-zinc-500 hover:text-sky-500 font-semibold transition-colors"
          >
            Reply
          </button>

          <LikeButton
            targetId={comment.id}
            userId={currentUser.id}
            initialLikesCount={comment._count?.likes || 0}
            initialHasLiked={comment.hasLiked}
            type="comment"
            size="sm"
          />
        </div>

        {isReplying && (
          <div className="mt-2">
            <CommentForm
              postId={postId}
              authorId={currentUser.id}
              parentId={comment.id}
              onSuccess={() => setIsReplying(false)}
            />
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-3 pt-2">
            {comment.replies.map((reply) => (
              <SubCommentItem
                key={reply.id}
                reply={reply}
                postId={postId}
                parentId={comment.id}
                currentUser={currentUser}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SubCommentItem({
  reply,
  postId,
  parentId,
  currentUser,
}: {
  reply: CommentWithAuthor;
  postId: string;
  parentId: string;
  currentUser: CurrentUser;
}) {
  const [isReplying, setIsReplying] = useState(false);
  const profileUrl = `/${reply.author.username}`;

  return (
    <div className="flex gap-3">
      <Link href={profileUrl} className="shrink-0 h-fit">
        <Avatar src={reply.author.image} name={reply.author.name} size="xs" />
      </Link>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-1 text-sm overflow-hidden whitespace-nowrap">
          <Link
            href={profileUrl}
            className="font-bold text-white hover:underline truncate text-xs"
          >
            {reply.author.name}
          </Link>

          {reply.author.emailVerified && (
            <BadgeCheck className="w-3.5 h-3.5 text-white fill-sky-500 shrink-0" />
          )}

          {reply.author.username && (
            <Link
              href={profileUrl}
              className="text-zinc-500 truncate shrink-0 hover:text-zinc-400 transition-colors text-xs"
            >
              @{reply.author.username}
            </Link>
          )}

          <span className="text-zinc-500 shrink-0 text-xs">·</span>
          <span className="text-zinc-500 shrink-0 hover:underline cursor-pointer text-xs">
            {formatTimeAgo(reply.createdAt)}
          </span>
        </div>

        <p className="text-sm text-zinc-300 whitespace-pre-wrap">
          {reply.content}
        </p>

        <div className="flex items-center gap-4 mt-1">
          <button
            onClick={() => setIsReplying(!isReplying)}
            className="text-xs text-zinc-500 hover:text-sky-500 font-semibold transition-colors"
          >
            Reply
          </button>

          <LikeButton
            targetId={reply.id}
            userId={currentUser.id}
            initialLikesCount={reply._count?.likes || 0}
            initialHasLiked={reply.hasLiked}
            type="comment"
            size="sm"
          />
        </div>

        {isReplying && (
          <div className="mt-2">
            <CommentForm
              postId={postId}
              authorId={currentUser.id}
              parentId={parentId}
              onSuccess={() => setIsReplying(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function Avatar({
  src,
  name,
  size = "md",
}: {
  src?: string | null;
  name?: string | null;
  size?: "xs" | "sm" | "md";
}) {
  const sizeClasses = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name ?? "User avatar"}
        className={`${sizeClasses[size].split(" ")[0]} ${sizeClasses[size].split(" ")[1]} rounded-full object-cover shrink-0 hover:opacity-80 transition-opacity`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-zinc-700 font-bold text-white flex items-center justify-center shrink-0 hover:opacity-80 transition-opacity`}
    >
      {name?.[0]?.toUpperCase() ?? "U"}
    </div>
  );
}
