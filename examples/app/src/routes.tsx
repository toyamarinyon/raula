import { Hello } from "./pages/Hello";
import { World } from "./pages/World";
import { createRoutes } from "raula";
export const routes = createRoutes()
  .add("/", <Hello />)
  .add("/world", <World />);
