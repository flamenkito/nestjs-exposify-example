export const byId = <T extends { id: unknown }>(id: unknown) => {
  return (it: T) => it.id === id;
};
