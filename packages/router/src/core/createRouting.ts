import { pathToRegexp } from './helper/regexpHelper'
import { AnyZodObject, z } from 'zod'

export type RoutePath<T extends string | number | symbol> =
  T extends `/${infer _}/:${infer Param}/${infer Rest}`
    ? { [K in Param | keyof RoutePath<`/${Rest}`>]: string | number }
    : T extends `/${infer _}/:${infer Param}`
    ? { [K in Param]: string | number }
    : // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Record<string, any>

type RenderComponent<Path extends string, search> = ({
  params,
  search,
}: {
  params: RoutePath<Path>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  search: z.infer<search extends AnyZodObject ? search : any>
}) => JSX.Element

export type LayoutComponent = (props: { page: JSX.Element }) => JSX.Element

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RouteHandler<Path extends string, Search = any> = {
  renderComponent: RenderComponent<Path, Search>
  search: Search
  layout?: LayoutComponent
}

export type RouteRecord<
  Path extends string = string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Search extends AnyZodObject = any
> = Record<Path, RouteHandler<Path, Search>>

type RoutingOption = {
  layout?: LayoutComponent
  notFound?: JSX.Element
}

export function createRouting(option: RoutingOption = {}) {
  return new RoutingBuilder({}, option)
}

export class RoutingBuilder<R extends RouteRecord> {
  routeRecords: R
  private layout?: LayoutComponent
  private notFound?: JSX.Element
  constructor(route: R, option?: RoutingOption) {
    this.routeRecords = route
    this.layout = option?.layout
    this.notFound = option?.notFound
  }
  add<Path extends string>(
    path: Path,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handler: RenderComponent<Path, any>
  ): RoutingBuilder<R & RouteRecord<Path>>
  add<Path extends string, S extends AnyZodObject>(
    path: Path,
    search: S,
    handler: RenderComponent<Path, S>
  ): RoutingBuilder<R & RouteRecord<Path, S>>
  add<Path extends string, S extends AnyZodObject>(
    path: Path,
    search: S | RenderComponent<Path, S>,
    handler?: RenderComponent<Path, S>
  ) {
    return new RoutingBuilder(
      {
        ...this.routeRecords,
        ...({
          [path]: {
            renderComponent: typeof search === 'function' ? search : handler,
            search: typeof search === 'object' ? search : undefined,
            layout: this.layout,
          },
        } as RouteRecord<Path, S>),
      },
      {
        layout: this.layout,
        notFound: this.notFound,
      }
    )
  }
  setLayout(component: LayoutComponent) {
    this.layout = component
    return this
  }
  resolve<Path extends string>(path: Path, search?: string) {
    const paths = Object.keys(this.routeRecords)
    const regexp = paths.map((path) => pathToRegexp(path).source).join('|')
    const match = new RegExp(regexp).exec(path)
    if (match == null) {
      if (this.notFound != null) {
        return this.notFound
      }
      throw new Error(`Route ${path} is not found`)
    }
    const index = match.lastIndexOf(path)
    const paramRegexp = new RegExp(pathToRegexp(paths[index - 1], true))
    const result = paramRegexp.exec(path)
    const route = this.routeRecords[paths[index - 1]] as RouteHandler<
      string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any
    >

    const searchParams = new URLSearchParams(search)
    if (route.layout != null) {
      return route.layout({
        page: route.renderComponent({
          params: result?.groups ?? {},
          search: Object.fromEntries(searchParams.entries()),
        }),
      })
    }

    return route.renderComponent({
      params: result?.groups ?? {},
      search: Object.fromEntries(searchParams.entries()),
    })
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type inferRoute<T> = T extends RoutingBuilder<any>
  ? T['routeRecords']
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
