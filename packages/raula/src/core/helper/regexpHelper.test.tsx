import { it, expect } from "vitest";
import { pathToRegexp } from "./regexpHelper";

it("converts a path to a regexp", () => {
  const regexp = pathToRegexp("/posts/:postId");
  const path = "/posts/2";
  expect(regexp.test(path)).toBeTruthy();
  const match = regexp.exec(path);
  if (match == null) {
    throw new Error();
  }
  expect(match.index).toBe(0);
  expect(match.length).toBe(2);

  const path2 = "/posts/hello-world";
  expect(regexp.test(path2)).toBeTruthy();
  const match2 = regexp.exec(path2);
  if (match2 == null) {
    throw new Error();
  }
  expect(match2.index).toBe(0);
  expect(match2.length).toBe(2);
});

it("converts a path and a param to a regexp", () => {
  const regexp = pathToRegexp("/posts/:postId", true);
  expect(regexp.test("/posts/2")).toBeTruthy();
  const match = "/posts/2".match(regexp);
  if (match == null) {
    throw new Error();
  }
  expect(match.index).toBe(0);
  expect(match.length).toBe(3);
  expect(match[2]).toBe("2");


  const path2 = "/posts/hello-world";
  expect(regexp.test(path2)).toBeTruthy();
  const match2 = regexp.exec(path2);
  if (match2 == null) {
    throw new Error();
  }
  expect(match2.index).toBe(0);
  expect(match2.length).toBe(3);
  expect(match2[2]).toBe("hello-world");
});
