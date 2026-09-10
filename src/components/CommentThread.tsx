import { getCommentsForTweet } from "@/app/actions/getcomments";

export default async function CommentThread({ postId }: { postId: string }) {
  const comments = await getCommentsForTweet(postId);

  return (
    <div className="space-y-4">
      {comments.map((level1) => (
        <div key={level1.id} className="border-b pb-2">
          <p className="font-semibold">{level1.content}</p>
          <div className="ml-6 mt-2 space-y-2 border-l-2 pl-3">
            {level1.replies.map((level2) => (
              <p key={level2.id} className="text-sm text-gray-600">
                {level2.content}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
