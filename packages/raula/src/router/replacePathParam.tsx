import { Router } from "./useRouter";
import { inferRoute, RoutePath } from "../core/RouteBuilder";

export function replacePathParam<T extends keyof inferRoute<Router>>(
  path: T,
  params: RoutePath<T>
) {
  if (typeof path !== "string") {
    throw new Error("path must be a string");
  }
  return path.replace(/(:\w+)/g, (_, token) => {
    const key = token.slice(1);
    if (params.hasOwnProperty(key)) {
      return (params as Record<string, any>)[key];
    }
    throw new Error(`Missing param: ${key}`);
  });
}
