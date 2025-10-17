import { IsString } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsString()
  description: string;
}
