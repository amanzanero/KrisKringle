type ClassNamesInput = string | boolean | undefined;

export const classnames = (...args: ClassNamesInput[]) => {
  const classNames = args.filter((arg) => typeof arg === "string");
  return classNames.join(" ");
};
