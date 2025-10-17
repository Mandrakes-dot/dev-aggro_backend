import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongoId } from '../utils/types/mongo-id.type';
import { Product, ProductDocument } from './product.schema';
import { CreateProductDto } from './dto/request/create-product.dto';
import { UpdateProductDto } from './dto/request/update-product.dto';

@Injectable()
export class ProductRepository {
  private readonly PRODUCT_NOT_FOUND_EXCEPTION = new NotFoundException(
    'Product not found',
  );
  constructor(
    @InjectModel(Product.name) private readonly model: Model<Product>,
  ) {}

  getAllProduct = (): Promise<ProductDocument[]> => this.model.find().exec();

  findByTypeLike = (partialType: string): Promise<ProductDocument[]> =>
    this.model
      .find({
        name: { $regex: partialType, $options: 'i' },
      })
      .exec();

  createProduct = (createProductDto: CreateProductDto, farmId: MongoId) =>
    this.model.create({
      name: createProductDto.name,
      type: createProductDto.type,
      description: createProductDto.description,
      farm: farmId,
    });

  updateProduct = (
    updateProduct: UpdateProductDto,
    id: MongoId,
  ): Promise<ProductDocument> =>
    this.model
      .findByIdAndUpdate(
        { _id: id },
        { $set: { name: updateProduct.name } },
        { new: true },
      )
      .orFail(this.PRODUCT_NOT_FOUND_EXCEPTION)
      .exec();

  getLastCreatedProducts = (): Promise<ProductDocument[]> =>
    this.model
      .find()
      .sort({ createdAt: -1 }) // trie par date décroissante (du plus récent au plus ancien)
      .limit(10) // limite à 10 résultats
      .exec();

  deleteProduct = (id: MongoId) =>
    this.model
      .findByIdAndDelete(id)
      .orFail(this.PRODUCT_NOT_FOUND_EXCEPTION)
      .exec();
}
