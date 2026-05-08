import { HttpStatus } from '@nestjs/common';

export type PaginationResponse = {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
};

export type BaseResponse<T> = {
  statusCode?: HttpStatus;
  success?: boolean;
  data: T | null;
  message?: string;
  devMessage?: string | null;
  pagination?: PaginationResponse;
};

export const calculatePaginationMeta = (
  total: number,
  page: number,
  perPage: number,
): PaginationResponse => ({
  total,
  page,
  perPage,
  totalPages: Math.ceil(total / perPage),
});

export const successResponse = <T>(
  response: BaseResponse<T>,
): BaseResponse<T> => ({
  statusCode: response.statusCode || HttpStatus.OK,
  success: true,
  message: response.message || 'Successfully',
  data: response.data || null,
});

export const paginationResponse = <T>(
  data: T,
  total: number,
  page: number,
  perPage: number,
  message?: string,
): BaseResponse<T> => ({
  statusCode: HttpStatus.OK,
  message: message || 'Get list successfully',
  success: true,
  data,
  pagination: calculatePaginationMeta(total, page, perPage),
});
