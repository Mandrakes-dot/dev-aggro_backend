import { Body, Controller, Post } from '@nestjs/common';
import { FarmService } from './farm.service';
import { CreateFarmDto } from './dto/request/create-farm.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Farm')
@Controller('farm')
export class FarmController {
  constructor(private readonly farmService: FarmService) {}

  @ApiOperation({ summary: 'Create Farm' })
  @Post()
  createProduct(@Body() createFarmDto: CreateFarmDto) {
    return this.farmService.createFarm(createFarmDto);
  }
}
