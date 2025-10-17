import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

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

  @Prop({ type: Types.ObjectId, ref: 'Farm', required: true })
  farm: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
