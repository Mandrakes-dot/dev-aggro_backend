import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
  Scope,
  Type,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { FilterQuery, isValidObjectId, Model } from 'mongoose';
import { CustomValidationOptions } from '../decorator/unique-exist.decorator';
import { ClassType } from '../decorator/unique-exist-validator.decorator';

export function getDocumentByIdPipe<T>(
  model: ClassType<T>,
  validationOptions?: CustomValidationOptions<T>,
): Type<PipeTransform> {
  @Injectable({ scope: Scope.REQUEST })
  class GetByIdDynamicPipe implements PipeTransform {
    constructor(private readonly moduleRef: ModuleRef) {}

    async transform(value: string, metadata: ArgumentMetadata): Promise<T> {
      if (!validationOptions?.property && !isValidObjectId(value)) {
        throw new BadRequestException('INVALID_MONGO_ID');
      }

      const modelToken = getModelToken(
        validationOptions?.discriminator ?? model.name,
      );
      const modelInstance = this.moduleRef.get<Model<T>>(modelToken, {
        strict: false,
      });

      const query: FilterQuery<any> = {
        [validationOptions?.property ?? '_id']: value,
      };
      /*if (validationOptions?.queries) {
        const customQueries =
          //typeof validationOptions.queries === 'function'
            ? validationOptions.queries(metadata.data)
            : validationOptions.queries;
        query = { ...query, ...customQueries };
      }*/
      if (!validationOptions?.excludeDeleted) query.deletedAt = null;

      const document = await modelInstance
        .findOne(query)
        .populate(validationOptions?.populate ?? [])
        .exec();
      if (!document) {
        throw new BadRequestException(`${model.name.toUpperCase()}_NOT_FOUND`);
      }

      return document;
    }
  }

  return GetByIdDynamicPipe;
}
