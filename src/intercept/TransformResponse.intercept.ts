import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import { SKIP_TRANSFORM } from 'src/decorator/SkipTransform.decorator';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const skipTransform = this.reflector.get<boolean>(
      SKIP_TRANSFORM,
      context.getHandler(),
    );
    if (skipTransform) {
      return next.handle();
    }
    const code = context.switchToHttp().getResponse().statusCode;
    return next.handle().pipe(
      map((data) => {
        console.log(
          '\n 🎯-> checked TransformResponseInterceptor checked map checked data: 📮 --- 📮',
          code,
          data,
        );

        return {
          code,
          data,
          msg: 'success',
        };
      }),
    );
  }
}
