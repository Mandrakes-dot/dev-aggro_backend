import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ProductTypeEnum } from './_utils/product-type.enum';
import { MinioFile, MinioFileSchema } from '../minio/minio-file.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ProductTypeEnum })
  type: ProductTypeEnum;

  @Prop({ type: [MinioFileSchema], default: [] })
  pictures: MinioFile[];

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'Farm', required: true })
  farm: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
