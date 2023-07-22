import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  diskSpace: number;

  @Prop()
  usedSpace: number;

  @Prop()
  picture: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Album' }] })
  albums: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
