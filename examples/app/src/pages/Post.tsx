import { posts } from "../data/posts";

interface Props {
  postId: string;
}
export const Post = ({ postId }: Props): JSX.Element => {
  const post = posts[postId as keyof typeof posts];
  return (
    <main>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </main>
  );
};
