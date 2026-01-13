import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './auth.dto';
import { PUBLIC_METHODS } from './public.decorator';
import { hasAllPermissions, METHOD_PERMISSIONS } from './permissions.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const body = request.body;
    const methodName = body?.method;

    // Check if this is a JSON-RPC request with a public method
    if (methodName && PUBLIC_METHODS.has(methodName)) {
      return true;
    }

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Missing authorization token');
    }

    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync(token);
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    // Check permission requirements for the method
    if (methodName && METHOD_PERMISSIONS.has(methodName)) {
      const requiredPermissions = METHOD_PERMISSIONS.get(methodName)!;
      const userRole = payload.role;

      if (!hasAllPermissions(userRole, requiredPermissions)) {
        throw new ForbiddenException(
          `Access denied. Required permissions: ${requiredPermissions.join(', ')}`,
        );
      }
    }

    return true;
  }

  private extractTokenFromHeader(request: { headers: { authorization?: string } }): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
