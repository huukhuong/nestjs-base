import { HttpStatus } from '@nestjs/common';
import {
  FindManyOptions,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { BaseResponse, paginationResponse } from '../responses';

export type PaginationQuery = {
  page: number;
  perPage: number;
  orderBy?: string;
  order?: OrderDirection;
};

export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 10;
const MAX_PER_PAGE = 100;

export const normalizePaginationQuery = (
  page?: number | string,
  perPage?: number | string,
  orderBy?: string,
  order?: string,
): PaginationQuery => {
  const parsedPage = Number(page);
  const parsedPerPage = Number(perPage);

  const safePage =
    Number.isFinite(parsedPage) && parsedPage > 0
      ? Math.floor(parsedPage)
      : DEFAULT_PAGE;

  const safePerPageRaw =
    Number.isFinite(parsedPerPage) && parsedPerPage > 0
      ? Math.floor(parsedPerPage)
      : DEFAULT_PER_PAGE;
  const safePerPage = Math.min(safePerPageRaw, MAX_PER_PAGE);

  return {
    page: safePage,
    perPage: safePerPage,
    orderBy: orderBy?.trim() || undefined,
    order:
      order?.toUpperCase() === OrderDirection.ASC
        ? OrderDirection.ASC
        : OrderDirection.DESC,
  };
};

const isQueryBuilder = <T extends ObjectLiteral>(
  target: Repository<T> | SelectQueryBuilder<T>,
): target is SelectQueryBuilder<T> => {
  return 'getManyAndCount' in target && 'skip' in target && 'take' in target;
};

export const paginate = async <T extends ObjectLiteral, R = T>(
  target: Repository<T> | SelectQueryBuilder<T>,
  query: PaginationQuery,
  options?: {
    repositoryFindOptions?: FindManyOptions<T>;
    message?: string;
    transform?: (item: T) => R;
    defaultOrderBy?: string;
    allowedOrderBy?: string[];
    queryBuilderOrderPrefix?: string;
  },
): Promise<BaseResponse<R[]>> => {
  const { page, perPage, orderBy, order } = normalizePaginationQuery(
    query.page,
    query.perPage,
    query.orderBy,
    query.order,
  );
  const skip = (page - 1) * perPage;
  const normalizedOrderBy = (() => {
    const candidate = orderBy || options?.defaultOrderBy;
    if (!candidate) {
      return undefined;
    }

    if (
      options?.allowedOrderBy &&
      !options.allowedOrderBy.includes(candidate)
    ) {
      return options.defaultOrderBy;
    }

    return candidate;
  })();

  let rows: T[];
  let total: number;

  if (isQueryBuilder(target)) {
    if (normalizedOrderBy) {
      const prefixedOrderBy = options?.queryBuilderOrderPrefix
        ? `${options.queryBuilderOrderPrefix}.${normalizedOrderBy}`
        : normalizedOrderBy;
      target.orderBy(prefixedOrderBy, order);
    }
    [rows, total] = await target.skip(skip).take(perPage).getManyAndCount();
  } else {
    const orderOption = normalizedOrderBy
      ? ({
          [normalizedOrderBy]: order,
        } as FindManyOptions<T>['order'])
      : undefined;

    [rows, total] = await target.findAndCount({
      ...(options?.repositoryFindOptions || {}),
      ...(orderOption ? { order: orderOption } : {}),
      skip,
      take: perPage,
    });
  }

  const transformedRows = options?.transform
    ? rows.map(options.transform)
    : (rows as unknown as R[]);

  return paginationResponse(
    transformedRows,
    total,
    page,
    perPage,
    options?.message || 'Get list successfully',
  );
};

export const toPaginationHttpResponse = <T>(
  data: T,
  total: number,
  page: number,
  perPage: number,
  message?: string,
) =>
  paginationResponse(
    data,
    total,
    page,
    perPage,
    message || 'Get list successfully',
  );

export const toSuccessHttpResponse = <T>(data: T, message?: string) => ({
  statusCode: HttpStatus.OK,
  success: true,
  message: message || 'Successfully',
  data,
});
