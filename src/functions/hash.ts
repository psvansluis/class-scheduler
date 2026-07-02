export const hash = (str: string) =>
  [...str].reduce((hash, char) => (hash << 5) - hash + char.charCodeAt(0), 0);
