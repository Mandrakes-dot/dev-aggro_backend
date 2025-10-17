import { Injectable } from '@nestjs/common';
import { GetUserDto } from './dto/response/GetUserDto.dto';
import { UserDocument } from './user.schema';

@Injectable()
export class UserMapper {
  constructor() {}

  toGetUsersDto = (users: UserDocument[]) =>
    users.map((station) => this.toGetUserDto(station));

  toGetUserDto = (user: UserDocument): GetUserDto => ({
    id: user._id.toString(),
    name: user.name,
    lastName: user.lastName,
    email: user.email,
  });
}
