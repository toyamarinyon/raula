import { renderHook } from "@testing-library/react";
import { it, expect } from "vitest";
import { createRouting } from "../core";
import { Router } from "./Router";
import { createMemoryHistory } from "history";
import { useRouter } from "./useRouter";
import { act } from "react-dom/test-utils";
import { ReactNode } from "react";
import { z } from "zod";

it("renders a route with a component", () => {
  const routes = createRouting()
    .add("/", () => <div>Hello</div>)
    .add("/users", z.object({ username: z.string() }), () => <div>users</div>)
    .add("/users/:userId", ({ params }) => <div>{params.userId}</div>);
  const history = createMemoryHistory({ initialEntries: ["/"] });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Router routes={routes} overrideHistory={history}>
      {children}
    </Router>
  );
  const { result } = renderHook(() => useRouter(), { wrapper });
  act(() => {
    result.current.router.push("/users", { search: { username: "hello" } });
  });
  expect(history.location.pathname).toBe("/users");
  expect(history.location.search).toBe("?username=hello");
  act(() => {
    result.current.router.push("/users/:userId", { params: { userId: 4 } });
  });
  expect(history.location.pathname).toBe("/users/4");
  act(() => {
    result.current.router.push("/users/:userId", { params: { userId: 4 } });
  });
  expect(history.location.pathname).toBe("/users/4");
});
