import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './product.schema';
import { ProductRepository } from './product.repository';
import { ProductMapper } from './product.mapper';
import { FarmModule } from '../farm/farm.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      },
    ]),
    FarmModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository, ProductMapper],
  exports: [ProductRepository, ProductService],
})
export class ProductModule {}
