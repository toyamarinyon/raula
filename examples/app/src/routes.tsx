import { Welcome } from "./pages/Welcome";
import { Post } from "./pages/Post";
import { createRouting } from "raula";
import { z } from "zod";
export const appRouter = createRouting()
  .add("/", z.object({ msg: z.string() }), () => <Welcome />)
  .add("/post/:postId", ({ params: { postId } }) => (
    <Post postId={postId as string} />
  ));

type AppRouter = typeof appRouter;
declare module "raula" {
  interface Router extends AppRouter {}
}
