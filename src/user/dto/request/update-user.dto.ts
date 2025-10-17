import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  name: string;

  @IsString()
  lastName: string;

  @IsString()
  location: string;

  @IsEmail()
  email: string;

  @IsOptional()
  farms: string[];
}
