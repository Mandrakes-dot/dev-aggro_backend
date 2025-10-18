import { Injectable } from '@nestjs/common';
import { ProductDocument } from './product.schema';
import { GetProductDto } from './_utils/dto/response/get-product.dto';
import { GetDetailProductDto } from './_utils/dto/response/get-detail-product.dto';
import { FarmDocument } from '../farm/farm.schema';

@Injectable()
export class ProductMapper {
  constructor() {}

  toGetProductsDto = (product: ProductDocument[]) =>
    product.map((product) => this.toGetProductDto(product));

  toGetProductDto = (product: ProductDocument): GetProductDto => ({
    name: product.name,
    description: product.description,
    type: product.type,
  });

  toGetDetailProductDto = (
    product: ProductDocument,
    farm: FarmDocument,
  ): GetDetailProductDto => ({
    id: product._id.toString(),
    name: product.name,
    description: product.description,
    type: product.type,
    farm: farm.name,
    location: farm.location,
  });
}
