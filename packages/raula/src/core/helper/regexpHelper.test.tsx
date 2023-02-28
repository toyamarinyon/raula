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
});

it("converts a path and a param to a regexp", () => {
  const regexp = pathToRegexp("/posts/:postId", true);
  expect(regexp.test("/posts/2")).toBeTruthy();
  const match = "/posts/2".match(regexp);
  if (match == null) {
    throw new Error();
  }
  console.log(Object.keys(match.groups ?? {}));
  expect(match.index).toBe(0);
  expect(match.length).toBe(3);
  expect(match[2]).toBe("2");
});

it("converts a path to a regexp", () => {
  const postRegexp = pathToRegexp("/posts/:postId");
  const usersRegexp = pathToRegexp("/users/:userId");
  const regexp = new RegExp(`${postRegexp.source}|${usersRegexp.source}`);
  const postMatch = "/posts/2".match(regexp);
  const postMatchIndex = postMatch?.lastIndexOf(postMatch?.[0]);
  if (postMatchIndex == null) {
    throw new Error();
  }
  expect(postMatchIndex).toBe(1);
  // expect(postMatch?.[postMatchIndex + 1]).toBe("2");
  const userMatch = "/users/3".match(regexp);
  expect(userMatch?.lastIndexOf(userMatch?.[0])).toBe(2);
  const userMatchIndex = userMatch?.lastIndexOf(userMatch?.[0]);
  if (userMatchIndex == null) {
    throw new Error();
  }
  // expect(userMatch?.[userMatchIndex+1]).toBe("3");
});

// it('reg', () => {
//   const regexp = new RegExp("(?<posts>/posts/(\d+))")
//   console.log(regexp)
//   const result = "/posts/2".match(regexp)
//   console.log(result)
//   expect(result).toBeTruthy()
//   expect(Object.keys(result?.groups ?? {})).toStrictEqual(['posts'])
// })
