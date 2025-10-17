import { Injectable } from '@nestjs/common';
import { FarmRepository } from './farm.repository';
import { FarmMapper } from './farm.mapper';
import { CreateFarmDto } from './dto/request/create-farm.dto';
import { GetFarmDto } from './dto/response/get-product.dto';

@Injectable()
export class FarmService {
  constructor(
    private readonly farmRepository: FarmRepository,
    private readonly farmMapper: FarmMapper,
  ) {}

  async createFarm(createProductDto: CreateFarmDto): Promise<GetFarmDto> {
    const product = await this.farmRepository.createFarm(createProductDto);
    return this.farmMapper.toGetFarmDto(product);
  }
}
