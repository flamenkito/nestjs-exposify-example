import { isObject } from '@example/utils';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { err, ok, Result, ResultAsync } from 'neverthrow';
import { JwtPayload } from './auth.dto';
import { hasAllPermissions, METHOD_PERMISSIONS } from './permissions.decorator';
import { PUBLIC_METHODS } from './public.decorator';

type AuthError =
  | 'INVALID_BODY'
  | 'MISSING_METHOD'
  | 'INVALID_HEADERS'
  | 'MISSING_AUTH'
  | 'INVALID_TOKEN_FORMAT'
  | 'INVALID_TOKEN'
  | 'FORBIDDEN';

const getMethod = (request: unknown): Result<string, AuthError> => {
  const body = (request as { body: unknown }).body;
  if (!isObject(body)) return err('INVALID_BODY');
  const method = body['method'];
  return typeof method === 'string' ? ok(method) : err('MISSING_METHOD');
};

const getAuthorizationHeader = (request: unknown): Result<string, AuthError> => {
  const headers = (request as { headers: unknown }).headers;
  if (!isObject(headers)) return err('INVALID_HEADERS');
  const auth = headers['authorization'];
  return typeof auth === 'string' ? ok(auth) : err('MISSING_AUTH');
};

const extractBearerToken = (authorization: string): Result<string, AuthError> => {
  const parts = authorization.split(' ');
  const type = parts[0];
  const token = parts[1];
  if (type !== 'Bearer' || token === undefined) {
    return err('INVALID_TOKEN_FORMAT');
  }
  return ok(token);
};

const setUser = (request: unknown, user: JwtPayload): void => {
  (request as { user: JwtPayload }).user = user;
};

const checkPermissions = (method: string, role: string): Result<void, AuthError> => {
  const requiredPermissions = METHOD_PERMISSIONS.get(method);
  if (!requiredPermissions) return ok(undefined);
  return hasAllPermissions(role, requiredPermissions) ? ok(undefined) : err('FORBIDDEN');
};

const authErrorToException = (error: AuthError): Error => {
  switch (error) {
    case 'INVALID_TOKEN':
      return new UnauthorizedException('Invalid token');
    case 'FORBIDDEN':
      return new ForbiddenException('Access denied');
    default:
      return new UnauthorizedException('Missing or invalid authorization token');
  }
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<unknown>();
    const method = getMethod(request);

    // Public method — allow without auth
    if (method.isOk() && PUBLIC_METHODS.has(method.value)) {
      return true;
    }

    const result = await getAuthorizationHeader(request)
      .andThen(extractBearerToken)
      .asyncAndThen((token) =>
        ResultAsync.fromPromise(this.jwtService.verifyAsync<JwtPayload>(token), (): AuthError => 'INVALID_TOKEN'),
      )
      .andThen((payload) => {
        setUser(request, payload);
        return method.isOk() ? checkPermissions(method.value, payload.role) : ok(undefined);
      });

    if (result.isErr()) {
      throw authErrorToException(result.error);
    }

    return true;
  }
}
