import { ValidationOptions } from 'class-validator';
import { FilterQuery, PopulateOptions } from 'mongoose';

export interface CustomValidationOptions<T> {
  property?: keyof T | '_id' | undefined;
  queries?: FilterQuery<T> | undefined;
  excludeDeleted?: boolean | undefined;
  excludeNull?: boolean | undefined;
  isCaseInsensitive?: boolean | undefined;
  populate?: PopulateOptions | (string | PopulateOptions)[];
  discriminator?: string | undefined;
}

export type UniqueExistsValidationOptions<T> = CustomValidationOptions<T> &
  ValidationOptions;
