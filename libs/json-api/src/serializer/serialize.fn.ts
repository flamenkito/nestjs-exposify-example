import { isAttributeMetadata, isRelationshipMetadata } from '../guards';
import type { Resource } from '../types';
import { getJsonApiMetadata, kebabize } from '../utils';

interface HasId {
  id: string | number;
}

export const serialize = <T extends HasId>(item: T, metadataType?: string): Resource => {
  const { id } = item;
  const type = metadataType ?? kebabize(item.constructor.name);

  return Object.keys(item).reduce<Resource>(
    (acc, key) => {
      const metadata = getJsonApiMetadata(item, key);

      if (isAttributeMetadata(metadata)) {
        acc.attributes ??= {};
        acc.attributes[metadata.attribute] = item[key as keyof T];
      } else if (isRelationshipMetadata(metadata)) {
        acc.relationships ??= {};
        const data = item[key as keyof T];

        if (data != null) {
          if (Array.isArray(data)) {
            acc.relationships[metadata.relationship] = data.map((rel) =>
              serialize(rel as unknown as HasId, metadata.type),
            );
          } else {
            acc.relationships[metadata.relationship] = serialize(data as unknown as HasId, metadata.type);
          }
        }
      }

      return acc;
    },
    { id, type },
  );
};
