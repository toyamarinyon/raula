import { Link } from "raula";
import { routes } from "../routes";

export const Hello = (): JSX.Element => (
  <div>
    Hello
    <Link to={routes.path["/world"]()}>World</Link>
  </div>
);
