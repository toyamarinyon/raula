import { Link, useRouter } from "raula";
import { FormEventHandler, useCallback, useMemo, useState } from "react";
import { posts as postData } from "../data/posts";

interface Props {
  query: string;
}
export const PostList = ({ query = "" }: Props): JSX.Element => {
  const { router } = useRouter();
  const [newQuery, setNewQuery] = useState(query);
  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (e) => {
      e.preventDefault();
      router.push("/posts", { search: { q: newQuery } });
    },
    [newQuery]
  );
  const posts = useMemo(
    () => postData.filter((post) => post.title.includes(query)),
    [query]
  );
  return (
    <div>
      <h1>Posts</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="query">Title:</label>
        <input
          type="text"
          name="query"
          value={newQuery}
          onChange={(e) => setNewQuery(e.target.value)}
        />
        <button type="submit">Filter</button>
      </form>

      <ul>
        {posts.map(({ title, id }) => (
          <li key={id}>
            {/* You remove params and an error appears */}
            <Link to="/post/:postId" params={{ postId: id }}>
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
