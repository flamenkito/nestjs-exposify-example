export const byId =
  <T extends string | number>(id: T) =>
  (item: { id: T }) =>
    item.id === id;
