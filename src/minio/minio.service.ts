import { Injectable, Logger } from '@nestjs/common';
import { Client } from 'minio';
import { MemoryStoredFile } from 'nestjs-form-data';
import * as exifr from 'exifr';
import { MinioFile } from './minio-file.schema';

@Injectable()
export class MinioService {
  private readonly logger = new Logger(MinioService.name);
  private readonly minioClient: Client;
  private readonly bucket: string;
  private readonly publicUrl?: string;

  constructor() {
    const endPoint = process.env.MINIO_PRIVATE_HOST;
    const port = Number(process.env.MINIO_PRIVATE_PORT ?? 9000);
    const useSSL = String(process.env.MINIO_USE_SSL ?? 'false') === 'true';
    const accessKey = process.env.MINIO_ACCESS_KEY;
    const secretKey = process.env.MINIO_SECRET_KEY;

    if (!endPoint) throw new Error('Missing env: MINIO_ENDPOINT');
    if (!accessKey || !secretKey)
      throw new Error('Missing MINIO_ACCESS_KEY/SECRET_KEY');

    this.minioClient = new Client({
      endPoint,
      port,
      useSSL,
      accessKey,
      secretKey,
    });
    this.bucket = process.env.MINIO_BUCKET || 'devagro';
    this.publicUrl = process.env.MINIO_PUBLIC_URL;
  }

  private async ensureBucket() {
    try {
      const exists = await this.minioClient.bucketExists(this.bucket);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucket, '');
        this.logger.log(`Created bucket: ${this.bucket}`);
      }
    } catch (e) {
      this.logger.debug(`ensureBucket: ${String(e)}`);
    }
  }

  uploadFile = async (
    file: MemoryStoredFile,
    key: string,
  ): Promise<MinioFile> => {
    await this.ensureBucket();

    let createdAt = new Date();
    try {
      const exif = await exifr.parse(file.buffer, { translateValues: false });
      const dt = (exif as any)?.DateTimeOriginal ?? (exif as any)?.CreateDate;
      if (dt) createdAt = new Date(dt);
    } catch (e) {
      this.logger.debug(`EXIF parse failed for ${file.originalName}: ${e}`);
    }

    await this.minioClient.putObject(this.bucket, key, file.buffer, file.size, {
      'Content-Type': file.mimetype, // ✅ correct property name
    });

    return {
      key,
      fileName: file.originalName,
      mimeType: file.mimetype,
      createdAt,
      size: file.size,
    };
  };

  async getUrlImage(key: string, expiresSeconds = 600, contentType?: string) {
    const url = await this.minioClient.presignedUrl(
      'GET',
      this.bucket,
      key,
      expiresSeconds,
      {
        ...(contentType ? { 'response-content-type': contentType } : {}),
      },
    );
    if (this.publicUrl) {
      const u = new URL(url);
      const p = new URL(this.publicUrl);
      u.protocol = p.protocol;
      u.host = p.host;
      return u.toString();
    }
    return url;
  }

  async sendImage(file: MemoryStoredFile, prefix = '') {
    const key = `${prefix}${file.originalName}`;
    return this.uploadFile(file, key);
  }
}
