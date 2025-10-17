import { Injectable } from '@nestjs/common';
import { ProductDocument } from './product.schema';
import { ProductRepository } from './product.repository';
import { ProductMapper } from './product.mapper';
import { NotFoundException } from '@nestjs/common';
import { FarmDocument } from '../farm/farm.schema';
import { CreateProductDto } from './_utils/dto/request/create-product.dto';
import { GetProductDto } from './_utils/dto/response/get-product.dto';
import { UpdateProductDto } from '../farm/dto/request/update-product.dto';
import { GetAllProductPaginatedQueryDto } from './_utils/dto/request/get-all-products-paingated-query.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productMapper: ProductMapper,
  ) {}

  async createProduct(
    createProductDto: CreateProductDto,
    farm: FarmDocument,
  ): Promise<GetProductDto> {
    const product = await this.productRepository.createProduct(
      createProductDto,
      farm._id,
    );
    return this.productMapper.toGetDetailProductDto(product, farm.name);
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

  async getLastProductCreated(): Promise<GetProductDto[]> {
    const products = await this.productRepository.getLastCreatedProducts();

    if (!products || products.length === 0) {
      throw new NotFoundException('Aucun produit trouvé');
    }

    return this.productMapper.toGetProductsDto(products);
  }

  getProductById(product: ProductDocument): GetProductDto {
    return this.productMapper.toGetProductDto(product);
  }

  async getAllProductPaginated(
    getAllProductPaginatedQueryDto: GetAllProductPaginatedQueryDto,
  ) {
    const products = await this.productRepository.getAllProductPaginated(
      getAllProductPaginatedQueryDto,
    );

    return this.productMapper.toGetDetailProductsDto(products, '');
  }
}
