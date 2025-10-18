import { Injectable } from '@nestjs/common';
import { GetUserDto } from './dto/response/GetUserDto.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { UserDocument } from './user.schema';
import { UserRepository } from './user.repository';
import { UserMapper } from './user.mapper';
import { CreateUserDto } from './dto/request/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userMapper: UserMapper,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<GetUserDto> {
    const user = await this.userRepository.createUser(createUserDto);
    return this.userMapper.toGetUserDto(user);
  }

  async updateUser(
    updateUserDto: UpdateUserDto,
    user: UserDocument,
  ): Promise<GetUserDto> {
    const updatedStation = await this.userRepository.updateUser(
      updateUserDto,
      user._id,
    );

    return this.userMapper.toGetUserDto(updatedStation);
  }

  async deleteUser(user: UserDocument) {
    await this.userRepository.deleteUser(user._id);
  }
}
