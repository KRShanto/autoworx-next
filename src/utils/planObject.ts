export function planObject<T>(obj: T) {
  return obj ? JSON.parse(JSON.stringify(obj)) : obj;
}
