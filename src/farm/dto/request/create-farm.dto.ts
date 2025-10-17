import { IsString } from 'class-validator';

export class CreateFarmDto {
  @IsString()
  name: string;

  @IsString()
  location: string;

  @IsString()
  description: string;
}
