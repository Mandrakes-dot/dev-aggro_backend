import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { User, UserDocument } from './user.schema';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { CreateUserDto } from './dto/request/create-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { getDocumentByIdPipe } from '../_utils/pipe/get-document-by-id.pipe';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Put(':userId')
  @ApiOperation({ summary: 'Update user' })
  updateUser(
    @Param('userId', getDocumentByIdPipe(User)) user: UserDocument,
    @Body() updateStationDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(updateStationDto, user);
  }
}
