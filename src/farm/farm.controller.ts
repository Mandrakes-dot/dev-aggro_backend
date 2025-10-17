import { Body, Controller, Post } from '@nestjs/common';
import { FarmService } from './farm.service';
import { CreateFarmDto } from './dto/request/create-farm.dto';

@Controller('farm')
export class FarmController {
  constructor(private readonly farmService: FarmService) {}

  @Post()
  createProduct(@Body() createFarmDto: CreateFarmDto) {
    return this.farmService.createFarm(createFarmDto);
  }
}
