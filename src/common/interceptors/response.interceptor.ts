import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { BaseResponse, successResponse } from '../responses';

const isBaseResponse = (value: unknown): value is BaseResponse<unknown> =>
  !!value && typeof value === 'object' && 'success' in value && 'data' in value;

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  BaseResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<BaseResponse<T>> {
    return next.handle().pipe(
      map(data => {
        if (isBaseResponse(data)) {
          return data as BaseResponse<T>;
        }

        const statusCode = context
          .switchToHttp()
          .getResponse<{ statusCode?: number }>().statusCode;

        return successResponse({
          statusCode: (statusCode as HttpStatus) || HttpStatus.OK,
          data: data ?? null,
        });
      }),
    );
  }
}
