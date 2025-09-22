export function splitCamelCaseToTitle(str: string) {
  return str
    .replace(/([A-Z])/g, " $1")
    .trim()
    .replace(/^./, (char) => char.toUpperCase());
}
