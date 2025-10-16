import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class SomeTest {
  @Prop({ required: true })
  name: string;
}

export type TestDocument = HydratedDocument<SomeTest>;
export const TestSchema = SchemaFactory.createForClass(SomeTest);
