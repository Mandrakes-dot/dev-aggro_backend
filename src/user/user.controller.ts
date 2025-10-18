import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { getDocumentByIdPipe } from '../utils/pipe/get-document-by-id.pipe';
import { User, UserDocument } from './user.schema';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { CreateUserDto } from './dto/request/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Put(':userId')
  updateUser(
    @Param('userId', getDocumentByIdPipe(User)) user: UserDocument,
    @Body() updateStationDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(updateStationDto, user);
  }

  @Put(':userId')
  deleteUser(@Param('userId', getDocumentByIdPipe(User)) user: UserDocument) {
    return this.userService.deleteUser(user);
  }
}
