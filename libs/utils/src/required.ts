type ErrorConstructor = new (message: string) => Error;

/**
 * Throws an error indicating a required value is missing.
 * Use with nullish coalescing for "or throw" pattern:
 *
 * @example
 * const user = users.find(byId(id)) ?? required(`user with id ${id}`);
 *
 * @example
 * const user = users.find(byId(id)) ?? required(`user with id ${id}`, NotFoundException);
 */
export const required = (
  name: string,
  ExceptionType?: ErrorConstructor,
): never => {
  const message = `Expected ${name}`;
  if (ExceptionType) {
    throw new ExceptionType(message);
  }
  throw new Error(message);
};
