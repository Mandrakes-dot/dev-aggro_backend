import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { getDocumentByIdPipe } from '../utils/pipe/get-document-by-id.pipe';
import { ProductService } from './product.service';
import { Product, ProductDocument } from './product.schema';
import { UpdateProductDto } from './dto/request/update-product.dto';
import { CreateProductDto } from './dto/request/create-product.dto';
import { FindByNameLikeDto } from './dto/request/find-by-name-like.dto';
import { Farm, FarmDocument } from '../farm/farm.schema';

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

  @Post('search')
  searchProductForName(@Body() name: FindByNameLikeDto) {
    return this.productService.searchProductForName(name.name);
  }

  @Get('lastproductcreated')
  getLastProductCreated() {
    return this.productService.getLastProductCreated();
  }

  @Get(':productId')
  getProductById(
    @Param('productId', getDocumentByIdPipe(Product)) product: ProductDocument,
  ) {
    return this.productService.getProductById(product);
  }
}
