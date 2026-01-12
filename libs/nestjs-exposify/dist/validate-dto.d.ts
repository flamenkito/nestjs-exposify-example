import { ValidationError } from 'class-validator';
export type ClassConstructor<T> = new () => T;
export declare class DtoValidationError extends Error {
    readonly errors: ValidationError[];
    constructor(errors: ValidationError[]);
}
export declare function validateDto<T extends object>(cls: ClassConstructor<T>, plain: unknown): Promise<T>;
