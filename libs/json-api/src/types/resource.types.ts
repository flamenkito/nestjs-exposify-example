export interface Resource<A = Record<string, unknown>, R = Record<string, unknown>> {
  id: string | number;
  type: string;
  // eslint-disable-next-line no-restricted-syntax -- JSON:API spec allows optional attributes
  attributes?: A;
  // eslint-disable-next-line no-restricted-syntax -- JSON:API spec allows optional relationships
  relationships?: R;
}
