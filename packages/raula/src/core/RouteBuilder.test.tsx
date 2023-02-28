import { it, expect } from "vitest";
import { z } from "zod";
import { createRouter, RouteBuilder } from "./RouteBuilder";

it("creates a new route", () => {
  const route = createRouter();
  expect(route).toBeInstanceOf(RouteBuilder);
});
it("adds a route", () => {
  createRouter().add(
    "/posts/:postId",
    z.object({ hello: z.string() }),
    ({ params }) => <div>{params.postId}</div>
  );
});
it("adds a route with search", () => {
  createRouter().add(
    "/posts/:postId",
    z.object({ hello: z.string() }),
    ({ params, search }) => (
      <div>
        {params.postId}, {search.hello}
      </div>
    )
  );
});
it("resolves a route", () => {
  const route = createRouter()
    .add("/users/:userId", ({ params }) => <div>{params.userId}</div>)
    .add(
      "/posts/:postId",
      z.object({ hello: z.string() }),
      ({ params, search }) => (
        <div>
          postId: {params.postId}, hello: {search.hello}
        </div>
      )
    );
  expect(route.resolve("/users/4")).toMatchInlineSnapshot(`
    <div>
      4
    </div>
  `);
  expect(route.resolve("/posts/6", "?hello=2")).toMatchInlineSnapshot(`
    <div>
      postId: 
      6
      , hello: 
      2
    </div>
  `);
});
