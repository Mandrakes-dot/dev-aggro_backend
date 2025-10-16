import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SomeTest, TestSchema } from './someTest';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SomeTest.name, schema: TestSchema }, // <-- registers provider "TestModel"
    ]),
  ],
  controllers: [TestController],
})
export class TestModule {}
