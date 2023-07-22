import { ObjectId } from 'mongoose';

export class CreateTrackDto {
  readonly name: string;
  readonly artist: string;
  readonly text: string;
  readonly albumId: ObjectId;
}
