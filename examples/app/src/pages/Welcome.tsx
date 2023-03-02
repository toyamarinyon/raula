import { Link, useRouter } from "raula";
import { useCallback } from "react";
import { posts } from "../data/posts";
export const Welcome = (): JSX.Element => {
  const { router } = useRouter();
  const handleSubmit = useCallback(() => {
    router.push("/");
  }, []);
  return (
    <div>
      <h1>Posts</h1>
      <button onClick={handleSubmit}>link</button>
      <Link to="/" search={{ msg: "hello" }}>
        Link
      </Link>
      <ul>
        {Object.keys(posts).map((key) => (
          <li key={key}>
            <Link to="/post/:postId" params={{ postId: key }}>
              {posts[key as keyof typeof posts].title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
