//import { MinioFile, MinioFileSchema } from '../minio/minio-file.schema';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string;

  // @Prop({ type: [MinioFileSchema], default: [] })
  // pictures: MinioFile[];

  @Prop({ required: true })
  description: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
