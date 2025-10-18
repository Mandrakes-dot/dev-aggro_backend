import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Farm, FarmDocument } from './farm.schema';
import { CreateFarmDto } from './dto/request/create-farm.dto';
import { MongoId } from '../utils/types/mongo-id.type';

@Injectable()
export class FarmRepository {
  private readonly FARM_NOT_FOUND_EXCEPTION = new NotFoundException(
    'Farm not found',
  );

  constructor(@InjectModel(Farm.name) private readonly model: Model<Farm>) {}

  getAllFarm = (): Promise<FarmDocument[]> => this.model.find().exec();

  async getFarmById(id: MongoId): Promise<FarmDocument> {
    return this.model.findById(id).orFail(this.FARM_NOT_FOUND_EXCEPTION).exec();
  }

  createFarm = (createFarmDto: CreateFarmDto) =>
    this.model.create({
      name: createFarmDto.name,
      location: createFarmDto.location,
      description: createFarmDto.description,
    });
}
