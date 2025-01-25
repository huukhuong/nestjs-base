import { HttpStatus } from '@nestjs/common';

interface IResponse<T> {
  code?: HttpStatus;
  success?: boolean;
  data?: T | null | undefined;
  message?: string | Array<string>;
  devMessage?: string | Array<string>;
  pagination?: Pagination | null | undefined;
}

interface Pagination {
  total: number;
  pages: number;
  perPage: number;
  currentPage: number;
}

export class BaseResponse<T> implements IResponse<T> {
  code: HttpStatus;
  success: boolean;
  data: T | null | undefined;
  message: string | Array<string>;
  devMessage?: string | Array<string> | undefined;
  pagination: Pagination | null | undefined;

  constructor(params: IResponse<T>) {
    this.code = params.code || 200;
    this.success = params.success || true;
    this.data = params.data || null;
    this.message = params.message || '';
    this.devMessage = params.devMessage;
    this.pagination = params.pagination || null;
    return this;
  }

  static success<T>(
    data: T,
    message: string = 'Successfully',
  ): BaseResponse<T> {
    return new BaseResponse<T>({
      code: HttpStatus.OK,
      success: true,
      data,
      message,
    });
  }

  static error(
    message: string | Array<string>,
    code: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ): BaseResponse<null> {
    return new BaseResponse({
      code,
      success: false,
      message,
    });
  }

  static paginate<T>(
    data: T[],
    currentPage: number,
    perPage: number,
    total: number,
  ) {
    const pages = Math.ceil(total / perPage);
    return new BaseResponse<T[]>({
      code: HttpStatus.OK,
      success: true,
      data,
      message: 'Successfully',
      pagination: {
        total,
        pages,
        perPage,
        currentPage,
      },
    });
  }
}
