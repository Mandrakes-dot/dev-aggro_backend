import { Controller, Post } from '@nestjs/common';
import { SomeTest } from './someTest';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Controller('test')
export class TestController {
  constructor(
    @InjectModel(SomeTest.name) private readonly model: Model<SomeTest>,
  ) {}

  @Post('create')
  createThing() {
    this.model.create({
      name: 'Thing',
    });
  }
}
