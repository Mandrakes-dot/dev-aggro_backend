import { Injectable } from '@nestjs/common';
import { ProductDocument } from './product.schema';
import { ProductRepository } from './product.repository';
import { ProductMapper } from './product.mapper';
import { NotFoundException } from '@nestjs/common';
import { FarmDocument } from '../farm/farm.schema';
import { CreateProductDto } from './_utils/dto/request/create-product.dto';
import { GetProductDto } from './_utils/dto/response/get-product.dto';
import { UpdateProductDto } from '../farm/dto/request/update-product.dto';
import { PaginatedQueryDto, PaginationDto } from '../utils/dto/pagination.dto';
import { FarmRepository } from '../farm/farm.repository';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly farmRepository: FarmRepository,
    private readonly productMapper: ProductMapper,
  ) {}

  async createProduct(
    createProductDto: CreateProductDto,
    farm: FarmDocument,
  ): Promise<GetProductDto> {
    const product = await this.productRepository.createProduct(
      createProductDto,
      farm._id.toString(),
    );
    return this.productMapper.toGetDetailProductDto(product, farm);
  }

  async updateProduct(
    updateProductDto: UpdateProductDto,
    product: ProductDocument,
  ): Promise<GetProductDto> {
    const updatedProduct = await this.productRepository.updateProduct(
      updateProductDto,
      product._id,
    );
    return this.productMapper.toGetProductDto(updatedProduct);
  }

  async searchProductForName(name: string): Promise<GetProductDto[]> {
    const products = await this.productRepository.findByTypeLike(name);

    if (!products || products.length === 0) {
      throw new NotFoundException(`Aucun produit trouvé pour "${name}"`);
    }

    return this.productMapper.toGetProductsDto(products);
  }

  async getLastProductCreated(paginatedQuery: PaginatedQueryDto) {
    console.log('1');
    const { products, totalCount } =
      await this.productRepository.getLastCreatedProductsPaginated(
        paginatedQuery.page,
        paginatedQuery.limit,
      );
    console.log('2');
    if (!products || products.length === 0) {
      throw new NotFoundException('Aucun produit trouvé');
    }
    console.log('3');

    const productDtos = this.productMapper.toGetProductsDto(products);
    console.log('4');
    return new PaginationDto(paginatedQuery, totalCount, productDtos);
  }

  async getProductById(product: ProductDocument): Promise<GetProductDto> {
    const farm = await this.farmRepository.getFarmById(product.farm);
    return this.productMapper.toGetDetailProductDto(product, farm);
  }
}
