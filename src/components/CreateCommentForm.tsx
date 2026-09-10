"use client";

import { useActionState, useEffect, useRef } from "react";
import { createComment, CommentState } from "@/app/actions/createcomment";

interface CommentFormProps {
  postId: string;
  authorId: string;
  parentId?: string;
  onSuccess?: () => void;
}

const initialState: CommentState = {};

export default function CommentForm({
  postId,
  authorId,
  parentId,
  onSuccess,
}: CommentFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(
    createComment,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      if (onSuccess) onSuccess();
    }
  }, [state.success, onSuccess]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-2 my-2"
    >
      <input type="hidden" name="postId" value={postId} />
      <input type="hidden" name="authorId" value={authorId} />
      {parentId && <input type="hidden" name="parentId" value={parentId} />}

      <textarea
        name="content"
        placeholder={parentId ? "Write a reply..." : "Post your reply..."}
        className="w-full p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={2}
        disabled={isPending}
      />

      {state.error && <p className="text-xs text-red-500">{state.error}</p>}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-1.5 bg-blue-500 text-white font-semibold rounded-full text-sm disabled:opacity-50"
        >
          {isPending ? "Posting..." : "Reply"}
        </button>
      </div>
    </form>
  );
}
