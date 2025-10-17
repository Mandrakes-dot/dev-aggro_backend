import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MinioModule } from '../minio/minio.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { UserRepository } from './user.repository';
import { UserMapper } from './user.mapper';

@Module({
  providers: [UserService, UserController, UserRepository, UserMapper],
  imports: [MinioModule, NestjsFormDataModule],
})
export class UserModule {}
