import { Link, useQuery } from "raula";
import { routes } from "../routes";

export const Hello = (): JSX.Element => {
  const {query} = useQuery()
  return (
  <div>
    Hello
    <Link to={routes.path["/world"]()}>World</Link>
    <pre>
      query is {JSON.stringify(query)}
    </pre>
  </div>
)};
