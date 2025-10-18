import { IsOptional, IsString } from 'class-validator';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFarmDto {
  @IsString()
  name: string;

  @IsString()
  location: string;

  @IsString()
  description: string;

  @IsFile({ each: true })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Images or PDF files',
    type: 'string',
    format: 'binary',
    isArray: true,
  })
  @MaxFileSize(1e6, { each: true })
  @HasMimeType(['application/pdf', 'image/png', 'image/jpeg'], { each: true })
  pictures?: MemoryStoredFile[];
}
