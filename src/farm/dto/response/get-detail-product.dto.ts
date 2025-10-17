import { IsString } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  name: string;

  @IsString()
  location: string;

  @IsString()
  description: string;

  product: string[];
}
