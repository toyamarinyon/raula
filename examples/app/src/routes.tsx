import { Hello } from "./pages/Hello";
import { World } from "./pages/World";
import { createRouter } from "raula";
export const appRouter = createRouter()
  .add("/", () => <Hello />)
  .add("/world", () => <World />);

type AppRouter = typeof appRouter;
declare module "raula" {
  interface Router extends AppRouter {}
}
