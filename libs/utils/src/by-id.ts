/**
 * Creates a predicate function for finding items by id.
 *
 * @example
 * const user = users.find(byId(userId));
 *
 * @example
 * const filteredUsers = users.filter(byId(targetId));
 */
export const byId =
  <T extends string | number>(id: T) =>
  (item: { id: T }) =>
    item.id === id;
