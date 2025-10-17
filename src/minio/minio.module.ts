import { MinioService } from './minio.service';
import { Module } from '@nestjs/common';
import { MinioMapper } from './minio.mapper';

@Module({
  providers: [MinioService, MinioMapper],
  exports: [MinioService, MinioMapper],
})
export class MinioModule {}
