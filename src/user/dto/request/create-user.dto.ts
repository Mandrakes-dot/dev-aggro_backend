import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
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
