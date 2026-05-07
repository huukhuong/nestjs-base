import {
  ExceptionFilter as NestExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  BadRequestException,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseException, IBaseException } from '../exceptions';
import { EExceptionCodes } from '../enum/exception-codes.enum';

const createErrorResponse = (
  statusCode: HttpStatus,
  message: string,
  devMessage: string | null = null,
): IBaseException => ({
  statusCode,
  message,
  devMessage,
  code: EExceptionCodes.INTERNAL_SERVER_ERROR,
});

@Catch()
export class ExceptionFilter implements NestExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Keep if exception is BaseException
    if (exception instanceof BaseException) {
      return response
        .status(exception.getStatus())
        .json(exception.getResponse());
    }

    // If exception is BadRequestException from ValidationPipe
    if (exception instanceof BadRequestException) {
      const exceptionResponse = exception.getResponse();

      // Check if it is validation error (object with field: messages)
      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse &&
        typeof exceptionResponse.message === 'object' &&
        !Array.isArray(exceptionResponse.message)
      ) {
        // Format: { field1: ['message1', 'message2'], field2: ['message3']
        const validationErrors = exceptionResponse.message as Record<
          string,
          string[]
        >;

        // Convert to array format: [{ field, message }]
        const formattedErrors: Array<{ field: string; message: string }> = [];
        Object.keys(validationErrors).forEach(field => {
          // Get first message for each field
          const message =
            validationErrors[field][0] || validationErrors[field].join(', ');
          formattedErrors.push({ field, message });
        });

        const errorResponse = {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          success: false,
          data: null,
          message: 'Validation failed',
          errors: formattedErrors,
          devMessage: exception instanceof Error ? exception.stack : null,
        };

        return response
          .status(HttpStatus.UNPROCESSABLE_ENTITY)
          .json(errorResponse);
      }

      // Fallback: if it is array messages (old format)
      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse &&
        Array.isArray(exceptionResponse.message)
      ) {
        const validationErrors = exceptionResponse.message as string[];
        const formattedErrors = validationErrors.join(', ');

        const errorResponse = {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          success: false,
          data: null,
          message: formattedErrors,
          devMessage: exception instanceof Error ? exception.stack : null,
        };

        return response
          .status(HttpStatus.UNPROCESSABLE_ENTITY)
          .json(errorResponse);
      }
    }

    // If exception is HttpException from NestJS - convert to BaseException format
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      const status = exception.getStatus();
      const message =
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
          ? (exceptionResponse.message as string)
          : 'An error occurred';

      const errorResponse = createErrorResponse(
        status,
        message,
        exception.stack || null,
      );

      return response.status(status).json(errorResponse);
    }

    // Other exceptions (Error, unknown, runtime errors) - convert to BaseException format
    const error =
      exception instanceof Error
        ? exception
        : new Error(String((exception as string) || 'Unknown error'));

    // Format same as BaseException - use helper to ensure consistency
    const errorResponse = createErrorResponse(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'An error occurred',
      error.stack || null,
    );

    Logger.error('Unhandled exception:', error || null);

    return response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(errorResponse);
  }
}
