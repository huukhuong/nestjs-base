import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { BaseResponse, successResponse } from '../responses';
import { reorderTimestampsInResponseData } from '../utils/reorder-timestamps-last';

const isBaseResponse = (value: unknown): value is BaseResponse<unknown> =>
  !!value && typeof value === 'object' && 'success' in value && 'data' in value;

const isMessageOnlyResponse = (value: unknown): value is { message: string } =>
  !!value &&
  typeof value === 'object' &&
  'message' in value &&
  typeof value.message === 'string' &&
  !('data' in value);

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  BaseResponse<unknown>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<BaseResponse<unknown>> {
    return next.handle().pipe(
      map(data => {
        if (isBaseResponse(data)) {
          return data;
        }

        const statusCode = context
          .switchToHttp()
          .getResponse<{ statusCode?: number }>().statusCode;

        if (isMessageOnlyResponse(data)) {
          return successResponse({
            statusCode: (statusCode as HttpStatus) || HttpStatus.OK,
            message: data.message,
            data: null,
          });
        }

        const payload = data ?? null;
        return successResponse({
          statusCode: (statusCode as HttpStatus) || HttpStatus.OK,
          data: reorderTimestampsInResponseData(payload),
        });
      }),
    );
  }
}
