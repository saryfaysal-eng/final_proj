import { CommentWithAuthor } from "./comment";
export type PostWithAuthor = {
  id: string;
  content: string;
  mediaUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  author: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
    emailVerified: boolean;
  };
  _count: {
    likes: number;
    comments: number;
  };
  comments?: CommentWithAuthor[];
  hasLiked: boolean;
};
