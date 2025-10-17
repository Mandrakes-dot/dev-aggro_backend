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
  createStation(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Put(':userId')
  updateStation(
    @Param('userId', getDocumentByIdPipe(User)) user: UserDocument,
    @Body() updateStationDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(updateStationDto, user);
  }

  /*@Delete(':stationId')
  deleteStation(
    @Param('stationId', getDocumentByIdPipe(Station)) station: StationDocument,
  ) {
    return this.stationsService.deleteStation(station);
  }*/
}
