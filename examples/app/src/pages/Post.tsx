import { posts } from "../data/posts";

interface Props {
  postId: string;
}
export const Post = ({ postId }: Props): JSX.Element => {
  const post = posts.find((post) => post.id === postId);
  if (post == null) {
    return <div>Not found</div>;
  }
  return (
    <main>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </main>
  );
};
