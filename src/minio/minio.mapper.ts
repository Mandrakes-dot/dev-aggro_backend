import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';

@Injectable()
export class MinioMapper {
  toItemAttachmentFileKey = (itemId: string): string =>
    `item/${itemId}/attachment-${DateTime.now().toMillis()}`;
}