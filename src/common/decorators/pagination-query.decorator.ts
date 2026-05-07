import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { Request } from 'express';
import {
  OrderDirection,
  normalizePaginationQuery,
  PaginationQuery,
} from '../pagination/pagination';

const paginationQueryParamFactory = createParamDecorator<
  unknown,
  PaginationQuery
>((_, ctx: ExecutionContext): PaginationQuery => {
  const request = ctx.switchToHttp().getRequest<Request>();
  return normalizePaginationQuery(
    request.query.page as string,
    request.query.perPage as string,
    request.query.orderBy as string,
    request.query.order as string,
  );
});

export const PaginationQueryParam = (): ParameterDecorator =>
  paginationQueryParamFactory();

export const ApiPaginationQuery: MethodDecorator = applyDecorators(
  ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Current page (starts from 1)',
  }),
  ApiQuery({
    name: 'perPage',
    required: false,
    type: Number,
    example: 10,
    description: 'Records per page (max 100)',
  }),
  ApiQuery({
    name: 'orderBy',
    required: false,
    type: String,
    example: 'createdAt',
    description: 'Order by field',
  }),
  ApiQuery({
    name: 'order',
    required: false,
    enum: OrderDirection,
    example: OrderDirection.DESC,
    description: 'Sort direction',
  }),
);
