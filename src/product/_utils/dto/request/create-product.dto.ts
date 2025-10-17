import { IsString } from 'class-validator';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProductTypeEnum } from '../../product-type.enum';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  type: ProductTypeEnum;

  @IsString()
  description: string;

  @IsFile({ each: true })
  @ApiPropertyOptional({
    description: 'Images or PDF files',
    type: 'string',
    format: 'binary',
    isArray: true,
  })
  @MaxFileSize(1e6, { each: true })
  @HasMimeType(['application/pdf', 'image/png', 'image/jpeg'], { each: true })
  pictures?: MemoryStoredFile[] = [];
}
