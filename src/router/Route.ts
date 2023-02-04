type Routes<P extends string = any> = Record<P, () => string>;
export function createRouter() {
  return new Router({});
}
export class Router<R extends Routes> {
  routes: R;
  constructor(routes: R) {
    this.routes = routes;
  }
  add<T extends string>(path: T, route: () => string) {
    return this.merge({ [path]: route } as Routes<T>);
  }
  resolve(path: string) {
    return this.routes[path]();
  }
  private merge<T extends Routes>(newRoutes: T) {
    return new Router({ ...this.routes, ...newRoutes });
  }
}

// const a: Route<"hello"> = { hello: () => "hello" } as const;
// const b: Route<"world"> = { world: () => "world" } as const;

// function addRoute<T extends string, R extends string>(
//   routes: Route<R>,
//   path: T,
//   route: () => string
// ) {
//   return { ...routes, [path]: route } as Route<R> & Route<T>;
// }
// type T_Routes = typeof a & typeof b;
// const d = addRoute(a, "world", () => "world");

// export class Router<T extends Route = any> {
//   private innerRoutes: Record<string, string>;
//   routes: T;

//   constructor(routes: T) {
//     this.innerRoutes = {};
//     this.routes = routes;
//   }
//   addRoute(path: string, name: string) {
//     this.innerRoutes[path] = name;
//     this.routes = new Route();
//     // this.routes[name] = () => this.innerRoutes[path];
//   }
//   resolve(path: string) {
//     return this.innerRoutes[path];
//   }
// }

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it("creates a new Router", () => {
    const router = createRouter();
    expect(router).toBeInstanceOf(Router);
  });
  it("adds a route", () => {
    createRouter().add("foo", () => "foo");
  });
  it("resolves a route", () => {
    const router = createRouter().add("foo", () => "foo");
    expect(router.resolve("foo")).toBe("foo");
  });
  it("gets the route", () => {
    const router = createRouter().add("foo", () => "foo");
    expect(router.routes.foo()).toBe("foo");
  });
}
