import { LayoutComponent, Link } from "raula";

export const Layout: LayoutComponent = ({ page }) => {
  return (
    <div>
      {/* A "layout route" is a good place to put markup you want to
          share across all the pages on your site, like navigation. */}
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/posts">Post list</Link>
          </li>
          <li>
            <Link to="/post/:postId" params={{ postId: "hello-world" }}>
              Hello world(post detail page)
            </Link>
          </li>
        </ul>
      </nav>
      {page}
    </div>
  );
};
