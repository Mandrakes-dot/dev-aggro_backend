import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, Max, Min } from 'class-validator';

export class PaginatedQueryDto {
  @ApiProperty({ default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @ApiProperty({ default: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 10;

  @ApiProperty({ required: false, default: false })
  @Type(() => Boolean)
  @IsBoolean()
  disablePagination = false;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}

export class PaginationMetaDto {
  currentPage: number;
  totalItemsCount: number;
  totalPagesCount: number;
  itemsPerPage: number;
}

export class PaginationDto<T> {
  meta: PaginationMetaDto;
  data: T[];

  constructor(
    paginatedQuery: PaginatedQueryDto,
    totalItemsCount: number,
    data: T[],
  ) {
    this.meta = {
      currentPage: paginatedQuery.page,
      totalItemsCount,
      totalPagesCount: paginatedQuery.disablePagination
        ? 1
        : Math.ceil(totalItemsCount / paginatedQuery.limit),
      itemsPerPage: paginatedQuery.disablePagination
        ? totalItemsCount
        : paginatedQuery.limit,
    };
    this.data = data;
  }
}
