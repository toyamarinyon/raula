import { renderHook } from "@testing-library/react";
import { it, expect } from "vitest";
import { createRouting } from "../core";
import { Router } from "./Router";
import { createMemoryHistory } from "history";
import { useRouter } from "./useRouter";
import { act } from "react-dom/test-utils";
import { ReactNode } from "react";

it("renders a route with a component", () => {
  const routes = createRouting()
    .add("/", () => <div>Hello</div>)
    .add("/users", () => <div>users</div>);
  const history = createMemoryHistory({ initialEntries: ["/"] });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Router routes={routes} overrideHistory={history}>
      {children}
    </Router>
  );
  const { result } = renderHook(() => useRouter(), { wrapper });
  act(() => {
    result.current.router.push("/users");
  });
  expect(history.location.pathname).toBe("/users");
});
