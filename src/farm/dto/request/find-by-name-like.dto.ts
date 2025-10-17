import { IsString } from 'class-validator';

export class FindByNameLikeDto {
  @IsString()
  name: string;
}
