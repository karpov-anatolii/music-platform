import { IAlbum } from "../album/album.types";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  diskSpace: number;
  usedSpace: number;
  picture: string;
  albums: IAlbum[];
}
