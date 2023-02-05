import { it, expect } from "vitest";
import { createRoutes, RoutesBuilder } from "./RoutesBuilder";

it("creates a new Router", () => {
  const router = createRoutes();
  expect(router).toBeInstanceOf(RoutesBuilder);
});
it("adds a route", () => {
  createRoutes().add("foo", <div>foo</div>);
});
it("resolves a route", () => {
  const router = createRoutes().add("foo", <div>foo</div>);
  expect(typeof router.resolve("foo")).toBe("object");
});
it("gets the route", () => {
  const router = createRoutes().add("/foo", <div>foo</div>);
  expect(router.path["/foo"]()).toBe("/foo");
});
