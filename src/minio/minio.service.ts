import { Injectable, Logger } from '@nestjs/common';
import { Client } from 'minio';
import { MemoryStoredFile } from 'nestjs-form-data';
import * as exifr from 'exifr';
import { MinioFile } from './minio-file.schema';

@Injectable()
export class MinioService {
  private readonly logger = new Logger(MinioService.name);

  private readonly clientInternal: Client; // for put/get via private network
  private readonly clientPublic?: Client;  // for presigning with public host
  private readonly bucket: string;

  constructor() {
    // ----- internal client (private host) -----
    const intHost = process.env.MINIO_PRIVATE_HOST!;
    const intPort = Number(process.env.MINIO_PRIVATE_PORT ?? 9000);
    const useSSLInternal = String(process.env.MINIO_USE_SSL ?? 'false') === 'true';
    const accessKey = process.env.MINIO_ACCESS_KEY || process.env.MINIO_ROOT_USER!;
    const secretKey = process.env.MINIO_SECRET_KEY || process.env.MINIO_ROOT_PASSWORD!;

    if (!intHost) throw new Error('Missing MINIO_PRIVATE_HOST');
    if (!accessKey || !secretKey) throw new Error('Missing MinIO credentials');

    this.clientInternal = new Client({
      endPoint: intHost, port: intPort, useSSL: useSSLInternal, accessKey, secretKey,
    });

    this.bucket = process.env.MINIO_BUCKET || 'devagro';

    // ----- public signer (optional) -----
    // Prefer MINIO_PUBLIC_URL, else assemble from host/port
    const publicBase =
      process.env.MINIO_PUBLIC_URL?.trim() ||
      process.env.MINIO_PUBLIC_ENDPOINT?.trim() ||
      (process.env.MINIO_PUBLIC_HOST
        ? `https://${process.env.MINIO_PUBLIC_HOST}${
          process.env.MINIO_PUBLIC_PORT && process.env.MINIO_PUBLIC_PORT !== '443'
            ? `:${process.env.MINIO_PUBLIC_PORT}`
            : ''
        }`
        : undefined);

    if (publicBase) {
      const u = new URL(publicBase);
      this.clientPublic = new Client({
        endPoint: u.hostname,
        port: Number(u.port || (u.protocol === 'https:' ? 443 : 80)),
        useSSL: u.protocol === 'https:',
        accessKey,
        secretKey,
      });
    }
  }

  private async ensureBucket() {
    const exists = await this.clientInternal.bucketExists(this.bucket);
    if (!exists) await this.clientInternal.makeBucket(this.bucket, '');
  }

  async uploadFile(file: MemoryStoredFile, key: string): Promise<MinioFile> {
    await this.ensureBucket();
    let createdAt = new Date();
    try {
      const exif = await exifr.parse(file.buffer, { translateValues: false });
      const dt = (exif as any)?.DateTimeOriginal ?? (exif as any)?.CreateDate;
      if (dt) createdAt = new Date(dt);
    } catch {}

    await this.clientInternal.putObject(this.bucket, key, file.buffer, file.size, {
      'Content-Type': file.mimetype,
    });

    return {
      key,
      fileName: file.originalName,
      mimeType: file.mimetype,
      createdAt,
      size: file.size,
    };
  }

  /** Presigned URL that already targets the PUBLIC domain (no string rewrite). */
  async getUrlImage(key: string, expiresSeconds = 600, contentType?: string) {
    const client = this.clientPublic ?? this.clientInternal; // fall back if no public config
    return client.presignedUrl('GET', this.bucket, key, expiresSeconds, {
      ...(contentType ? { 'response-content-type': contentType } : {}),
      'response-content-disposition': 'inline',
    });
  }
}
