import { ITrack } from "../track/track.types";

export interface IAlbum {
  _id: string;
  name: string;
  author: string;
  authorId: string;
  picture: string;
  tracks: ITrack[];
}
