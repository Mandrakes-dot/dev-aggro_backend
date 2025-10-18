import { IsString } from 'class-validator';

export class GetDetailProductDto {
  id: string;

  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsString()
  description: string;

  farm: string;

  location: string;
}
