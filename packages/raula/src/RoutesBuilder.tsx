type Routes<P extends string = any> = Record<P, JSX.Element>;
type Paths<P extends string = any> = Record<P, () => string>;
export function createRoutes() {
  return new RoutesBuilder({});
}
export class RoutesBuilder<R extends Routes = {}, P extends Paths = {}> {
  routes: R;
  path: P;
  constructor(routes = {} as R, path: P = {} as P) {
    this.routes = routes;
    this.path = path;
  }
  add<T extends string>(path: T, route: JSX.Element) {
    return this.merge(
      { [path]: route } as Routes<T>,
      {
        [path]: () => path,
      } as unknown as Paths<T>
    );
  }
  resolve(path: string) {
    return this.routes[path];
  }
  private merge<T extends Routes, S extends Paths>(newRoutes: T, newPath: S) {
    return new RoutesBuilder(
      { ...this.routes, ...newRoutes },
      { ...this.path, ...newPath }
    );
  }
}
