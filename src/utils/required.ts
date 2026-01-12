export const required = (name: string): never => {
  throw new Error(`Expected ${name}`);
};
