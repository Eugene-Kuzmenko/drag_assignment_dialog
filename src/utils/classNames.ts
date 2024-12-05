const getEnabledClassNames = (enabledByClassName: Record<string, unknown>): string[] => {
  const classNames = [];
  for (const className in enabledByClassName) {
    if (enabledByClassName[className]) classNames.push(className);
  }
  return classNames;
}

export const classNames = (...args: Array<string | Record<string, unknown>>): string => {
  return args.flatMap((className) => typeof className === "object" ? getEnabledClassNames(className) : className).join(" ")
}