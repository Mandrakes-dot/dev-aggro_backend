import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { getDocumentByIdPipe } from '../utils/pipe/get-document-by-id.pipe';
import { ProductService } from './product.service';
import { Product, ProductDocument } from './product.schema';
import { Farm, FarmDocument } from '../farm/farm.schema';
import { CreateProductDto } from './_utils/dto/request/create-product.dto';
import { UpdateProductDto } from '../farm/dto/request/update-product.dto';
import { PaginatedQueryDto } from '../utils/dto/pagination.dto';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('/:farmId')
  createProduct(
    @Body() createProductDto: CreateProductDto,
    @Param('farmId', getDocumentByIdPipe(Farm)) farm: FarmDocument,
  ) {
    return this.productService.createProduct(createProductDto, farm);
  }

  @Put('/:productId')
  updateProduct(
    @Param('productId', getDocumentByIdPipe(Product)) product: ProductDocument,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.updateProduct(updateProductDto, product);
  }

  @Get('lastproductcreated')
  getLastProductCreated(@Query() paginatedQuery: PaginatedQueryDto) {
    return this.productService.getLastProductCreated(paginatedQuery);
  }

  @Get(':productId')
  getProductById(
    @Param('productId', getDocumentByIdPipe(Product)) product: ProductDocument,
  ) {
    return this.productService.getProductById(product);
  }
}
