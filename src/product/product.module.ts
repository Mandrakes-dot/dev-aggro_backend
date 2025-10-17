import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';

@Module({
  providers: [ProductService, ProductController],
})
export class ProductModule {}
