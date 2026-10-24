/** Declares one slice of the dictionary; TypeScript forces `th` to have every key of `en`. */
export function defineDict<const T extends Record<string, string>>(en: T, th: Record<keyof T, string>) {
  return { en, th }
}
