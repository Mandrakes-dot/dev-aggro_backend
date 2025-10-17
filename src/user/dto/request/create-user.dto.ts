import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @ApiProperty({
    description: 'name',
  })
  name: string;

  @ApiProperty({
    description: 'lastName',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'location',
  })
  @IsString()
  location: string;

  @ApiProperty({
    description: 'email address',
  })
  @IsEmail()
  email: string;
}
