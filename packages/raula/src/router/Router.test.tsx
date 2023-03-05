import { render, screen } from "@testing-library/react";
import { it, expect } from "vitest";
import { createRouting } from "../core";
import { Router } from "./Router";
import { createMemoryHistory } from "history";

it("renders a route with a component", () => {
  const routes = createRouting().add("/", () => <div>Hello</div>);
  const history = createMemoryHistory({ initialEntries: ["/"] });
  render(<Router routes={routes} overrideHistory={history} />);
  expect(screen.getByText("Hello")).toBeTruthy();
});
