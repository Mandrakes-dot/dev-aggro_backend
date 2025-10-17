import { Module } from '@nestjs/common';
import { FarmService } from './farm.service';
import { FarmController } from './farm.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FarmRepository } from './farm.repository';
import { Farm, FarmSchema } from './farm.schema';
import { FarmMapper } from './farm.mapper';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Farm.name,
        schema: FarmSchema,
      },
    ]),
  ],
  controllers: [FarmController],
  providers: [FarmService, FarmRepository, FarmMapper],
  exports: [FarmRepository, FarmService],
})
export class FarmModule {}
