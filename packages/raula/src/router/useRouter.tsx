import { useContext, useMemo } from "react";
import { AnyZodObject, z } from "zod";
import { inferRoute } from "../core/createRouting";
import { RouterContext } from "./Router";
import { replacePathParam } from "./replacePathParam";

type inferRouteArgs<Path, Z> = Path extends `/${infer _}/:${infer Param}`
  ? Z extends AnyZodObject
    ? [{ search?: z.infer<Z>; params: { [K in Param]: string | number } }]
    : [{ params: { [K in Param]: string | number } }]
  : Z extends AnyZodObject
  ? [{ search: z.infer<Z> }] | []
  : [];

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Routing {}

type UseRouter = () => {
  router: {
    push: <T extends keyof inferRoute<Routing>>(
      path: T,
      ...args: inferRouteArgs<T, inferRoute<Routing>[T]["search"]>
    ) => void;
  };
};
export const useRouter: UseRouter = () => {
  const router = useContext(RouterContext);

  const push = useMemo(
    () =>
      <T extends keyof inferRoute<Routing>>(
        path: T,
        ...args: inferRouteArgs<T, inferRoute<Routing>[T]["search"]>
      ) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const arg0 = (args as [{ search?: any; params?: any }])[0];
        router.history.push({
          pathname: replacePathParam(path, arg0.params ?? ({} as unknown)),
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
