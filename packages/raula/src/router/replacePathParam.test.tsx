import { it, expect } from "vitest";
import { replacePathParam } from "./replacePathParam";

it("replacePathParam", () => {
  expect(replacePathParam("/posts/:postId", { postId: 2 })).toBe("/posts/2");
});
