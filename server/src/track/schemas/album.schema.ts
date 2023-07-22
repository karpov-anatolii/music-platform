import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';


export type AlbumDocument = HydratedDocument<Album>;

@Schema()
export class Album {
  @Prop()
  name: string;

  @Prop()
  author: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  authorId: Types.ObjectId;

  @Prop()
  picture: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Track' }] })
  tracks: Types.ObjectId[];
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
