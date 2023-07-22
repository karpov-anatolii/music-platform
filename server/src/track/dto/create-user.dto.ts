import { ObjectId } from 'mongoose';

export class CreateUserDto {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly diskSpace: number;
  readonly usedSpace: number;
  readonly albums: ObjectId[];
}
