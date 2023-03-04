import { Routing } from "./useRouter";
import { inferRoute, RoutePath } from "../core/createRouting";

export function replacePathParam<T extends keyof inferRoute<Routing>>(
  path: T,
  params: RoutePath<T>
) {
  if (typeof path !== "string") {
    throw new Error("path must be a string");
  }
  return path.replace(/(:\w+)/g, (_, token) => {
    const key = token.slice(1);
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (params as Record<string, any>)[key];
    }
    throw new Error(`Missing param: ${key}`);
  });
}
