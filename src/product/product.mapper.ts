import { Injectable } from '@nestjs/common';
import { ProductDocument } from './product.schema';
import { GetProductDto } from './_utils/dto/response/get-product.dto';
import { GetDetailProductDto } from './_utils/dto/response/get-detail-product.dto';
import { MinioMapper } from '../minio/minio.mapper';

@Injectable()
export class ProductMapper {
  constructor(private readonly minioMapper: MinioMapper) {}

  toGetProductsDto = async (
    products: ProductDocument[],
  ): Promise<GetProductDto[]> => {
    return Promise.all(products.map((p) => this.toGetProductDto(p)));
  };

  toGetProductDto = async (
    product: ProductDocument,
  ): Promise<GetProductDto> => ({
    name: product.name,
    description: product.description,
    type: product.type,
    pictures: await this.minioMapper.toGetAttachmentDtoFromArray(
      product.pictures,
    ),
  });

  toGetDetailProductDto = (
    product: ProductDocument,
    farmName: string,
  ): GetDetailProductDto => ({
    id: product._id.toString(),
    name: product.name,
    description: product.description,
    type: product.type,
    farm: farmName,
  });

  toGetDetailProductsDto = (
    products: ProductDocument[],
    farmName: string,
  ): GetDetailProductDto[] => {
    return products.map((p) => this.toGetDetailProductDto(p, farmName));
  };
}
