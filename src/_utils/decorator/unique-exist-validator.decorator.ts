import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import {
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Connection, FilterQuery, isValidObjectId } from 'mongoose';
import { UniqueExistsValidationOptions } from './unique-exist.decorator';

@ValidatorConstraint({ async: true })
@Injectable()
export class UniqueExistsConstraint implements ValidatorConstraintInterface {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async validate<T>(value: any, args: ValidationArguments) {
    const [entity, validationOptions, property, flag] = args.constraints;
    const options: UniqueExistsValidationOptions<T> = validationOptions || {};
    const propertyName = options.property || property;
    if (propertyName === '_id' && !isValidObjectId(value)) return false;
    const repository = this.connection.model(entity);
    const query: FilterQuery<any> = {
      [propertyName]: options.isCaseInsensitive
        ? { $regex: value, $options: 'i' }
        : value,
      ...options.queries,
    };
    if (options.excludeDeleted) query.deletedAt = null;
    if (options.excludeNull) query[propertyName] = { $ne: null };

    const result = await repository
      .findOne(query)
      .populate(validationOptions?.populate ?? [])
      .exec();
    return flag ? !!result : !result;
  }

  defaultMessage(args: ValidationArguments) {
    const constraintOptions = args.constraints[1] as { property?: string };
    const isIdCheck =
      constraintOptions?.property?.includes('id') ??
      (args.property.includes('id') && !isValidObjectId(args.value));

    if (isIdCheck) {
      return `${constraintOptions?.property ?? args.property} '${args.value}' is not a valid ObjectId`;
    }

    return `${args.property} '${args.value}' ${args.constraints[3] ? 'does not exist' : 'already exists'}`;
  }
}

export function IsUnique<T>(
  entity: ClassType<T>,
  validationOptions?: UniqueExistsValidationOptions<T>,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'isUnique',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [entity.name, validationOptions, propertyName, false],
      validator: UniqueExistsConstraint,
    });
  };
}

export function IsExisting<T>(
  entity: ClassType<T>,
  validationOptions?: UniqueExistsValidationOptions<T>,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'isExisting',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [entity, validationOptions, '_id', true],
      validator: UniqueExistsConstraint,
    });
  };
}

export type ClassType<T> = new (...args: any[]) => T;
