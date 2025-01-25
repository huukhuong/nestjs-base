import {
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsRelationByString,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsSelectByString,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { BaseException } from './exceptions/base-exception';
import { PaggingRequestDto } from './dto/pagging-req.dto';
import { PaggingResponseDto } from './dto/pagging-res.dto';

interface PaginationProps<T extends ObjectLiteral> {
  pageIndex: number;
  pageSize: number;
  repository?: Repository<T>;
  builder?: SelectQueryBuilder<T>;
  where?: FindManyOptions<T>['where'];
  withDeleted?: boolean;
  relations?: FindOptionsRelationByString | FindOptionsRelations<T>;
  select?: FindOptionsSelect<T> | FindOptionsSelectByString<T>;
  orderby?: FindOptionsOrder<T>;
}

const paginate = async <T extends ObjectLiteral>(
  props: PaginationProps<T>,
): Promise<PaggingResponseDto> => {
  const {
    pageIndex,
    pageSize,
    repository,
    builder,
    where,
    withDeleted,
    orderby,
  } = props;

  if (pageIndex <= 0 || pageSize <= 0) {
    throw new BaseException(
      'pageSize and pageIndex cannot be less than 1',
      500,
    );
  }

  let [data, total]: [T[], number] = [[], 0];

  const skip = (pageIndex - 1) * pageSize;

  if (repository) {
    const options: FindManyOptions<T> = {
      skip,
      take: pageSize,
      where,
      withDeleted,
      relations: props.relations,
      select: props.select,
      order: orderby,
    };

    [data, total] = await repository.findAndCount(options);
  }

  if (builder) {
    [data, total] = await builder.skip(skip).take(pageSize).getManyAndCount();
  }

  return {
    data: data,
    currentPage: pageIndex,
    perPage: pageSize,
    pages: Math.ceil(total / pageSize),
    total: total,
  };
};

export { paginate };
