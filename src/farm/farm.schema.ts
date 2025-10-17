//import { MinioFile, MinioFileSchema } from '../minio/minio-file.schema';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<Farm>;

@Schema({ timestamps: true })
export class Farm {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  location: string;

  // @Prop({ type: [MinioFileSchema], default: [] })
  // pictures: MinioFile[];

  @Prop({ required: true })
  description: string;

  @Prop({ default: null })
  isVerified: boolean | null;

  @Prop({ type: [Types.ObjectId], ref: 'Product', default: [] })
  products: Types.ObjectId[];
}

export const FarmSchema = SchemaFactory.createForClass(Farm);
