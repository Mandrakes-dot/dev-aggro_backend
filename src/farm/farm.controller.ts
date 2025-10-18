import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { FarmService } from './farm.service';
import { CreateFarmDto } from './dto/request/create-farm.dto';
import { getDocumentByIdPipe } from '../utils/pipe/get-document-by-id.pipe';
import { Farm, FarmDocument } from './farm.schema';

@Controller('farm')
export class FarmController {
  constructor(private readonly farmService: FarmService) {}

  @Post()
  createFarm(@Body() createFarmDto: CreateFarmDto) {
    return this.farmService.createFarm(createFarmDto);
  }

  @Put()
  updateFarm(@Body() createFarmDto: CreateFarmDto) {
    return this.farmService.createFarm(createFarmDto);
  }

  @Get(':farmId')
  getFarmById(@Param('farmId', getDocumentByIdPipe(Farm)) farm: FarmDocument) {
    return this.farmService.getFarmById(farm);
  }

  @Get()
  GetAllFarm() {
    return this.farmService.getAllFarm();
  }
}
