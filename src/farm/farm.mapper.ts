import { Injectable } from '@nestjs/common';
import { GetFarmDto } from './dto/response/get-product.dto';
import { FarmDocument } from './farm.schema';

@Injectable()
export class FarmMapper {
  constructor() {}

  toGetFarmsDto = (farms: FarmDocument[]) =>
    farms.map((farm) => this.toGetFarmDto(farm));

  toGetFarmDto = (farm: FarmDocument): GetFarmDto => ({
    id: farm.id,
    name: farm.name,
    description: farm.description,
    location: farm.location,
  });
}
