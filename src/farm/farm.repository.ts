import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Farm, FarmDocument } from './farm.schema';
import { CreateFarmDto } from './dto/request/create-farm.dto';
import { MinioFile } from '../minio/minio-file.schema';

@Injectable()
export class FarmRepository {
  private readonly FARM_NOT_FOUND_EXCEPTION = new NotFoundException(
    'Farm not found',
  );

  constructor(@InjectModel(Farm.name) private readonly model: Model<Farm>) {}

  getAllFarm = (): Promise<FarmDocument[]> => this.model.find().exec();

  createFarm = (createFarmDto: CreateFarmDto, pictures: MinioFile[]) =>
    this.model.create({
      name: createFarmDto.name,
      location: createFarmDto.location,
      description: createFarmDto.description,
      pictures: pictures,
    });
}
