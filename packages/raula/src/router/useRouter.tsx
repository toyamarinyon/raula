import { useContext, useMemo } from "react";
import { AnyZodObject, z } from "zod";
import { inferRoute } from "../core/RouteBuilder";
import { RouterContext } from "./Context";
import { replacePathParam } from "./replacePathParam";

type inferRouteArgs<Path, Z> = Path extends `/${infer _}/:${infer Param}`
  ? Z extends AnyZodObject
    ? [{ search?: z.infer<Z>; params: { [K in Param]: string | number } }]
    : [{ params: { [K in Param]: string | number } }]
  : Z extends AnyZodObject
  ? [{ search: z.infer<Z> }] | []
  : [];

export interface Router {}

type UseRouter = () => {
  router: {
    push: <T extends keyof inferRoute<Router>>(
      path: T,
      ...args: inferRouteArgs<T, inferRoute<Router>[T]["search"]>
    ) => void;
  };
};
export const useRouter: UseRouter = () => {
  const router = useContext(RouterContext);

  const push = useMemo(
    () =>
      <T extends keyof inferRoute<Router>>(
        path: T,
        ...args: inferRouteArgs<T, inferRoute<Router>[T]["search"]>
      ) => {
        const arg0 = (args as [{ search?: any; params?: any }])[0];
        router.history.push({
          pathname: replacePathParam(path, arg0.params ?? ({} as any)),
          search: arg0.search ? `?${new URLSearchParams(arg0.search)}` : "",
        });
      },
    [router.history]
  );
  return {
    router: {
      push,
    },
  };
};
