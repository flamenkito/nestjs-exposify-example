import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable()
export class DelayInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    // eslint-disable-next-line sonarjs/pseudo-random -- intentional for dev delay simulation
    const delayMs = Math.random() * 600 + 200; // 200-800ms
    return next.handle().pipe(delay(delayMs));
  }
}
