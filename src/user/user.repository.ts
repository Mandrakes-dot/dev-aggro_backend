import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { CreateUserDto } from './dto/request/create-user.dto';
import { MongoId } from '../utils/types/mongo-id.type';

@Injectable()
export class UserRepository {
  private readonly USER_NOT_FOUND_EXCEPTION = new NotFoundException(
    'User not found',
  );
  constructor(@InjectModel(User.name) private readonly model: Model<User>) {}

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
      .orFail(this.USER_NOT_FOUND_EXCEPTION)
      .exec();

  deleteUser = (id: MongoId) =>
    this.model
      .findByIdAndDelete(id)
      .orFail(this.USER_NOT_FOUND_EXCEPTION)
      .exec();
}
