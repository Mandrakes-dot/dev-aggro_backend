import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product, ProductDocument } from './product.schema';
import { Farm, FarmDocument } from '../farm/farm.schema';
import { CreateProductDto } from './_utils/dto/request/create-product.dto';
import { UpdateProductDto } from '../farm/dto/request/update-product.dto';
import { FindByNameLikeDto } from '../farm/dto/request/find-by-name-like.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetAllProductPaginatedQueryDto } from './_utils/dto/request/get-all-products-paingated-query.dto';
import { getDocumentByIdPipe } from '../_utils/pipe/get-document-by-id.pipe';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @ApiOperation({ summary: 'Create product' })
  @Post('/:farmId')
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

  @ApiOperation({ summary: 'Search product by name' })
  @Post('/product/search')
  searchProductByName(@Body() name: FindByNameLikeDto) {
    return this.productService.searchProductForName(name.name);
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
  @Get('paginated')
  getAllProductPaginated(
    @Query() getAllProductPaginatedQueryDto: GetAllProductPaginatedQueryDto,
  ) {
    return this.productService.getAllProductPaginated(
      getAllProductPaginatedQueryDto,
    );
  }
}
