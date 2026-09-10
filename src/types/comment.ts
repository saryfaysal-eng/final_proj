export type CommentWithAuthor = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  postId: string;
  authorId: string;
  parentId: string | null;
  author: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
    emailVerified: boolean;
  };
  _count: { likes: number };
  replies?: CommentWithAuthor[];
  hasLiked: boolean;
};
