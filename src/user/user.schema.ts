//import { MinioFile, MinioFileSchema } from '../minio/minio-file.schema';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  email: string;

  @Prop({ type: [Types.ObjectId], ref: 'Farm', default: [] })
  farms: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
