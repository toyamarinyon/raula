import { PostList } from "./pages/PostList";
import { Post } from "./pages/Post";
import { createRouting } from "raula";
import { z } from "zod";
import { Layout } from "./pages/Layout";

export const appRouter = createRouting()
  .setLayout(({ page }) => <Layout page={page} />)
  .add("/", () => <h1>Home</h1>)
  .add("/posts", z.object({ query: z.string() }), () => <PostList />)
  .add("/post/:postId", ({ params: { postId } }) => (
    <Post postId={postId as string} />
  ));

type AppRouter = typeof appRouter;
declare module "raula" {
  interface Routing extends AppRouter {}
}
