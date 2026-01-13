import { HttpException } from '@nestjs/common';

type HttpExceptionConstructor = new (message: string) => HttpException;

export const required = (
  name: string,
  ExceptionType?: HttpExceptionConstructor,
): never => {
  const message = `Expected ${name}`;
  if (ExceptionType) {
    throw new ExceptionType(message);
  }
  throw new Error(message);
};
