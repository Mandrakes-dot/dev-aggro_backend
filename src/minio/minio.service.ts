import { Injectable, Logger } from '@nestjs/common';
import * as Minio from 'minio';
import { MemoryStoredFile } from 'nestjs-form-data';
import { MinioFile } from './minio-file.schema';
import * as exifr from 'exifr';

@Injectable()
export class MinioService {
  private readonly minioClient: Minio.Client;
  private readonly minioBucketName: string;
  private logger = new Logger(MinioService.name);

  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT!,
      port: Number(process.env.MINIO_PORT || 9000),
      useSSL: String(process.env.MINIO_USE_SSL || 'false') === 'true', // false
      accessKey: process.env.MINIO_ACCESS_KEY!,
      secretKey: process.env.MINIO_SECRET_KEY!,
    });
  }

  uploadFile = async (
    file: MemoryStoredFile,
    key: string,
  ): Promise<MinioFile | undefined> => {
    const exifData = await exifr
      .parse(file.buffer, { translateValues: false })
      .catch((e) => this.logger.error(e));
    return this.minioClient
      ?.putObject(this.minioBucketName, key, file.buffer, file.size, {
        'Content-Type': file.mimetype,
      })
      .then(() => ({
        key: key,
        fileName: file.originalName,
        mimeType: file.mimetype,
        createdAt:
          exifData?.DateTimeOriginal ?? exifData?.CreateDate ?? new Date(),
        size: file.size,
      }));
  };

  async getUrlImage(objectName: MemoryStoredFile) {
    const url = await this.minioClient.presignedUrl(
      'GET',
      'images',
      objectName.originalName,
      10000,
      {
        'response-content-type': objectName.mimeType,
      },
    );
    return url.replace('minio:9000', 'minio.local');
  }

  async sendImage(object: MemoryStoredFile) {
    return this.minioClient.putObject(
      'devagro',
      object.originalName,
      object.buffer,
      object.size,
      {
        'Content-Type': object.mimeType,
      },
    );
  }
}
