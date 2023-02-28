import { BrowserHistory, createBrowserHistory } from "history";
import { createContext, useEffect, useMemo, useState } from "react";
import { RouteBuilder } from "../core/RouteBuilder";

interface Router {
  history: BrowserHistory;
}
export const RouterContext = createContext<Router>({} as Router);

type Props = {
  router: RouteBuilder<any>;
};
export const RouterProvider = ({ router }: Props): JSX.Element => {
  const history = useMemo(() => createBrowserHistory(), []);
  const [location, setLocation] = useState(history.location);

  useEffect(() => {
    const cleanup = history.listen(({ location }) => {
      setLocation(location);
    });
    return () => {
      cleanup();
    };
  }, [history]);
  return (
    <RouterContext.Provider value={{ history }}>
      {router.resolve(location.pathname, location.search)}
    </RouterContext.Provider>
  );
};
