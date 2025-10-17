import { WithId } from 'mongodb';
import { FlattenMaps, Types } from 'mongoose';

export type MongoId = Types.ObjectId | string | WithId<any>;

export type MapMongoDoc<T> = FlattenMaps<T> & { _id: Types.ObjectId };

export type MongoDoc<T> = MapMongoDoc<T> | WithId<T>;
