import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ProductDocument } from './product.schema';
import { ProductRepository } from './product.repository';
import { ProductMapper } from './product.mapper';
import { NotFoundException } from '@nestjs/common';
import { FarmDocument } from '../farm/farm.schema';
import { CreateProductDto } from './_utils/dto/request/create-product.dto';
import { GetProductDto } from './_utils/dto/response/get-product.dto';
import { UpdateProductDto } from '../farm/dto/request/update-product.dto';
import { GetAllProductPaginatedQueryDto } from './_utils/dto/request/get-all-products-paingated-query.dto';
import { MinioFile } from '../minio/minio-file.schema';
import { MongoId } from '../_utils/types/mongo-id.type';
import { MemoryStoredFile } from 'nestjs-form-data';
import { MinioService } from '../minio/minio.service';
import { MinioMapper } from '../minio/minio.mapper';
import { Types } from 'mongoose';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productMapper: ProductMapper,
    private readonly minioService: MinioService,
    private readonly minioMapper: MinioMapper,
  ) {}

  uploadAttachments = (attachments: MemoryStoredFile[], productId: MongoId) =>
    Promise.all(
      attachments.map(async (attachment, index) => {
        const itemAttachmentMinioKey = this.minioMapper.toItemAttachmentFileKey(
          `${productId.toString()}-${index}`,
        );
        const attachmentFile = await this.minioService.uploadFile(
          attachment,
          itemAttachmentMinioKey,
        );
        if (!attachmentFile)
          throw new InternalServerErrorException('Error during file upload');
        return attachmentFile;
      }),
    );

  async createProduct(
    createProductDto: CreateProductDto,
    farm: FarmDocument,
  ): Promise<GetProductDto> {
    const productId = new Types.ObjectId();

    const incoming = createProductDto.pictures ?? [];
    const files: MemoryStoredFile[] = Array.isArray(incoming)
      ? incoming
      : [incoming];

    const pictures: MinioFile[] = [];
    if (files.length > 0) {
      pictures.push(...(await this.uploadAttachments(files, productId)));
      if (pictures.length < files.length)
        throw new InternalServerErrorException('Error during file upload');
    }

    const product = await this.productRepository.createProduct(
      createProductDto,
      farm._id,
      pictures,
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
