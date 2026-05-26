const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' &&
  v !== null &&
  !Array.isArray(v) &&
  Object.getPrototypeOf(v) === Object.prototype;

export type DeepPartial<T> =
  T extends Record<string, unknown> ? { [K in keyof T]?: DeepPartial<T[K]> } : T;

export function deepMerge<T extends Record<string, unknown>>(
  base: T,
  override: DeepPartial<T> | undefined,
): T {
  if (!override) return { ...base };
  const result: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const current = result[key];
    if (isPlainObject(current) && isPlainObject(value)) {
      result[key] = deepMerge(current as Record<string, unknown>, value);
    } else if (value !== undefined) {
      result[key] = value;
    }
  }
  return result as T;
}
