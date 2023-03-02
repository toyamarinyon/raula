export const pathToRegexp = (path: string, captureParam = false) => {
  const replace = captureParam
    ? path.replace(/:(\w+)/g, (_, token) => `(?<${token}>[\\w-]+)`)
    : path.replace(/:\w+/g, "[\\w-]+");
  return new RegExp(`(^${replace}$)`);
};
