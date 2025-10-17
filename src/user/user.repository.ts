import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { CreateUserDto } from './dto/request/create-user.dto';
import { MongoId } from '../utils/types/mongo-id.type';

@Injectable()
export class UserRepository {
  private readonly PRODUCT_NOT_FOUND_EXCEPTION = new NotFoundException(
    'User not found',
  );
  constructor(@InjectModel(User.name) private readonly model: Model<User>) {}

  getAllStations = (): Promise<UserDocument[]> => this.model.find().exec();

  findOneByIdOrFail = (station: string) =>
    this.model
      .findOne({ name: station })
      .orFail(this.PRODUCT_NOT_FOUND_EXCEPTION)
      .exec();

  findOneByNameOrFail = (stationName: string) =>
    this.model
      .findOne({ name: stationName })
      .orFail(this.PRODUCT_NOT_FOUND_EXCEPTION)
      .exec();

  createUser = (createStationDto: CreateUserDto) =>
    this.model.create({
      name: createStationDto.name,
      lastName: createStationDto.lastName,
      email: createStationDto.email,
      location: createStationDto.location,
    });

  updateUser = (
    updateStation: UpdateUserDto,
    id: MongoId,
  ): Promise<UserDocument> =>
    this.model
      .findByIdAndUpdate(
        { _id: id },
        { $set: { name: updateStation.name } },
        { new: true },
      )
      .orFail(this.PRODUCT_NOT_FOUND_EXCEPTION)
      .exec();

  deleteStation = (id: MongoId) =>
    this.model
      .findByIdAndDelete(id)
      .orFail(this.PRODUCT_NOT_FOUND_EXCEPTION)
      .exec();
}
