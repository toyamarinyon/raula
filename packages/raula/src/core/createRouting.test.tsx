import { it, expect } from "vitest";
import { z } from "zod";
import { createRouting, RoutingBuilder } from "./createRouting";

it("creates a new route", () => {
  const route = createRouting();
  expect(route).toBeInstanceOf(RoutingBuilder);
});
it("adds a route", () => {
  createRouting().add(
    "/posts/:postId",
    z.object({ hello: z.string() }),
    ({ params }) => <div>{params.postId}</div>
  );
});
it("adds a route with search", () => {
  createRouting().add(
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
  const route = createRouting()
    .add("/", () => <div>home</div>)
    .add("/hello", () => <div>hello</div>)
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
  expect(route.resolve("/hello")).toMatchInlineSnapshot(`
    <div>
      hello
    </div>
  `);
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
