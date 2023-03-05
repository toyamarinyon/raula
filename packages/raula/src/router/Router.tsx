import { BrowserHistory, createBrowserHistory, History } from "history";
import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { RoutingBuilder } from "../core/createRouting";

interface TRouterContext {
  history: BrowserHistory;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  routes: RoutingBuilder<any>;
}
export const RouterContext = createContext<TRouterContext>(
  {} as TRouterContext
);

export interface RouterLayout {
  page: JSX.Element;
}

export type LayoutComponent = (props: RouterLayout) => JSX.Element;

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  routes: RoutingBuilder<any>;
  layout?: LayoutComponent;
  overrideHistory?: History;
  children?: ReactNode;
};
export const Router = ({
  routes,
  layout,
  overrideHistory,
  children,
}: Props): JSX.Element => {
  const history = useMemo(
    () => overrideHistory ?? createBrowserHistory(),
    [overrideHistory]
  );
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
    <RouterContext.Provider value={{ history, routes }}>
      <>
        {layout?.({
          page: routes.resolve(location.pathname, location.search),
        }) ?? routes.resolve(location.pathname, location.search)}
        {/* children props are used for test */}
        {children}
      </>
    </RouterContext.Provider>
  );
};
