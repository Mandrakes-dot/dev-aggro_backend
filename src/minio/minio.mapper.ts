import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { MinioFile } from './minio-file.schema';
import { GetPictureDetailDto } from '../product/_utils/dto/response/get-pictures-detail.dto';
import { MinioService } from './minio.service';

@Injectable()
export class MinioMapper {
  constructor(private minioService: MinioService) {}

  toItemAttachmentFileKey = (itemId: string): string =>
    `item/${itemId}/attachment-${DateTime.now().toMillis()}`;

  toGetAttachmentDtoFromArray = async (
    pictures: MinioFile[],
  ): Promise<GetPictureDetailDto[]> =>
    Promise.all(
      pictures.map((attachment) => this.toGetAttachmentDto(attachment)),
    );

  toGetAttachmentDto = async (
    attachment: MinioFile,
  ): Promise<GetPictureDetailDto> => ({
    key: attachment.key,
    name: attachment.fileName,
    url: await this.minioService.getUrlImage(
      attachment.key,
      60 * 10,
      attachment.mimeType,
    ),
  });
}
