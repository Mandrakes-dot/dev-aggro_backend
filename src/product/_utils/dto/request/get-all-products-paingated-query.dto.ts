import { PaginatedQueryDto } from '../../../../_utils/dto/request/paginated-query.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Optional } from 'class-validator-extended';
import { ProductTypeEnum } from '../../product-type.enum';

export class GetAllProductPaginatedQueryDto extends PaginatedQueryDto {
  @ApiProperty({
    description: 'Search by name, barcodeNumber',
  })
  @IsString()
  @Optional()
  search?: string;

  @ApiProperty({
    description: 'Product type filter',
  })
  @IsString()
  @Optional()
  type?: ProductTypeEnum;
}
