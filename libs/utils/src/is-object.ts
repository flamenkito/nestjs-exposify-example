/**
 * Type guard to check if a value is a non-null object.
 *
 * @example
 * if (isObject(value)) {
 *   console.log(value['key']); // value is Record<string, unknown>
 * }
 */
export const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;
