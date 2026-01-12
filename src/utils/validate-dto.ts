import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

type ClassConstructor<T> = new () => T;

export class DtoValidationError extends Error {
  constructor(public readonly errors: ValidationError[]) {
    const messages = errors
      .flatMap((e) => Object.values(e.constraints ?? {}))
      .join(', ');
    super(messages);
    this.name = 'DtoValidationError';
  }
}

/**
 * Validates and transforms plain object to a DTO class instance using class-validator.
 * @param cls - The DTO class constructor
 * @param plain - The plain object to validate
 * @returns Validated DTO instance
 * @throws DtoValidationError if validation fails
 */
export async function validateDto<T extends object>(
  cls: ClassConstructor<T>,
  plain: unknown,
): Promise<T> {
  const instance = plainToInstance(cls, plain);
  const errors = await validate(instance);

  if (errors.length > 0) {
    throw new DtoValidationError(errors);
  }

  return instance;
}
