import { Module } from '@nestjs/common';
import { FarmService } from './farm.service';
import { FarmController } from './farm.controller';

@Module({
  providers: [FarmService, FarmController],
})
export class FarmModule {}
