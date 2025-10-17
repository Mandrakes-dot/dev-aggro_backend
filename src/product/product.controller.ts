import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product, ProductDocument } from './product.schema';
import { Farm, FarmDocument } from '../farm/farm.schema';
import { CreateProductDto } from './_utils/dto/request/create-product.dto';
import { UpdateProductDto } from '../farm/dto/request/update-product.dto';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetAllProductPaginatedQueryDto } from './_utils/dto/request/get-all-products-paingated-query.dto';
import { getDocumentByIdPipe } from '../_utils/pipe/get-document-by-id.pipe';
import { FormDataRequest } from 'nestjs-form-data';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @ApiOperation({ summary: 'Create product' })
  @Post('/:farmId')
  @ApiConsumes('multipart/form-data')
  @FormDataRequest()
  createProduct(
    @Body() createProductDto: CreateProductDto,
    @Param('farmId', getDocumentByIdPipe(Farm)) farm: FarmDocument,
  ) {
    return this.productService.createProduct(createProductDto, farm);
  }

  @ApiOperation({ summary: 'Update product' })
  @Put('/:productId')
  updateProduct(
    @Param('productId', getDocumentByIdPipe(Product)) product: ProductDocument,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.updateProduct(updateProductDto, product);
  }

  @ApiOperation({ summary: 'Get last products created' })
  @Get('lastproductscreated')
  getLastProductCreated() {
    return this.productService.getLastProductCreated();
  }

  @ApiOperation({ summary: 'Get product by id' })
  @Get(':productId')
  getProductById(
    @Param('productId', getDocumentByIdPipe(Product)) product: ProductDocument,
  ) {
    return this.productService.getProductById(product);
  }

  @ApiOperation({ summary: 'Get all product paginated' })
  @Get('paginated/total')
  getAllProductPaginated(
    @Query() getAllProductPaginatedQueryDto: GetAllProductPaginatedQueryDto,
  ) {
    return this.productService.getAllProductPaginated(
      getAllProductPaginatedQueryDto,
    );
  }
}
