import { Welcome } from "./pages/Welcome";
import { Post } from "./pages/Post";
import { createRouter } from "raula";
import { z } from "zod";
export const appRouter = createRouter()
  .add("/", z.object({ msg: z.string() }), () => <Welcome />)
  .add("/post/:postId", ({ params: { postId } }) => (
    <Post postId={postId as string} />
  ));

type AppRouter = typeof appRouter;
declare module "raula" {
  interface Router extends AppRouter {}
}
