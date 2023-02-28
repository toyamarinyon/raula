export const pathToRegexp = (path: string, captureParam = false) => {
  const replace = captureParam
    ? path.replace(/:(\w+)/g, (_, token) => `(?<${token}>\\d+)`)
    : path.replace(/:\w+/g, "\\d+");
  return new RegExp(`(${replace})`);
};
