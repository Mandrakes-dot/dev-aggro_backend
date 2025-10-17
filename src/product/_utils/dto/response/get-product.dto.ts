import { GetPictureDetailDto } from './get-pictures-detail.dto';

export class GetProductDto {
  name: string;
  description: string;
  type: string;
  pictures: GetPictureDetailDto[];
}
