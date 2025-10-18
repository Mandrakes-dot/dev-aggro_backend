import { Injectable } from '@nestjs/common';
import { FarmRepository } from './farm.repository';
import { FarmMapper } from './farm.mapper';
import { CreateFarmDto } from './dto/request/create-farm.dto';
import { GetFarmDto } from './dto/response/get-product.dto';
import { FarmDocument } from './farm.schema';

@Injectable()
export class FarmService {
  constructor(
    private readonly farmRepository: FarmRepository,
    private readonly farmMapper: FarmMapper,
  ) {}

  async getAllFarm(): Promise<GetFarmDto[]> {
    const stations = await this.farmRepository.getAllFarm();
    return this.farmMapper.toGetFarmsDto(stations);
  }

  async createFarm(createProductDto: CreateFarmDto): Promise<GetFarmDto> {
    const product = await this.farmRepository.createFarm(createProductDto);
    return this.farmMapper.toGetFarmDto(product);
  }

  getFarmById(farmDocument: FarmDocument): GetFarmDto {
    return this.farmMapper.toGetFarmDto(farmDocument);
  }
}
