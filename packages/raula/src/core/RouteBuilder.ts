import { AnyZodObject, z } from "zod";
import { pathToRegexp } from "./helper/regexpHelper";

export type RoutePath<T extends string | number | symbol> =
  T extends `/${infer _}/:${infer Param}/${infer Rest}`
    ? { [K in Param | keyof RoutePath<`/${Rest}`>]: string | number }
    : T extends `/${infer _}/:${infer Param}`
    ? { [K in Param]: string | number }
    : {};

type RenderComponent<Path extends string, search> = ({
  params,
  search,
}: {
  params: RoutePath<Path>;
  search: z.infer<search extends AnyZodObject ? search : any>;
}) => JSX.Element;

type RouteHandler<Path extends string, Search = any> = {
  renderComponent: RenderComponent<Path, Search>;
  search: Search;
};

export type RouteRecord<
  Path extends string = string,
  Search extends AnyZodObject = any
> = Record<Path, RouteHandler<Path, Search>>;

export function createRouter() {
  return new RouteBuilder({});
}

export class RouteBuilder<R extends RouteRecord> {
  routeRecords: R;
  constructor(route: R) {
    this.routeRecords = route;
  }
  add<Path extends string>(
    path: Path,
    handler: RenderComponent<Path, any>
  ): RouteBuilder<R & RouteRecord<Path>>;
  add<Path extends string, S extends AnyZodObject>(
    path: Path,
    search: S,
    handler: RenderComponent<Path, S>
  ): RouteBuilder<R & RouteRecord<Path, S>>;
  add<Path extends string, S extends AnyZodObject>(
    path: Path,
    search: S | RenderComponent<Path, S>,
    handler?: RenderComponent<Path, S>
  ) {
    return new RouteBuilder({
      ...this.routeRecords,
      ...({
        [path]: {
          renderComponent: typeof search === "function" ? search : handler,
          search: typeof search === "object" ? search : undefined,
        },
      } as RouteRecord<Path, S>),
    });
  }
  resolve<Path extends string>(path: Path, search?: string) {
    const paths = Object.keys(this.routeRecords);
    const regexp = paths.map((path) => pathToRegexp(path).source).join("|");
    const match = new RegExp(regexp).exec(path);
    if (match == null) {
      throw new Error(`Route ${path} not found`);
    }
    const index = match.lastIndexOf(path);
    const paramRegexp = new RegExp(pathToRegexp(paths[index - 1], true));
    const result = paramRegexp.exec(path);
    const route = this.routeRecords[paths[index - 1]] as RouteHandler<
      string,
      any
    >;

    const searchParams = new URLSearchParams(search);

    return route.renderComponent({
      params: result?.groups ?? {},
      search: Object.fromEntries(searchParams.entries()),
    });
  }
}

export type inferRoute<T> = T extends RouteBuilder<any>
  ? T["routeRecords"]
  : any;
