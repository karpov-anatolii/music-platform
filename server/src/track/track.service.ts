import { Injectable, PipeTransform } from '@nestjs/common';
import { Track, TrackDocument } from './schemas/track.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreateTrackDto } from './dto/create-track.dto';
import { ObjectId } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FileService, FileType } from 'src/file/file.service';
import { Album, AlbumDocument } from './schemas/album.schema';
import { User, UserDocument } from './schemas/user.schema';
import * as path from 'path';
import * as uuid from 'uuid';
const sharp = require('sharp');
const fs = require('fs');

@Injectable()
export class TrackService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private fileService: FileService,
  ) {}
  async create(
    dto: CreateTrackDto,
    picturePath,
    audio,
    userId: string,
  ): Promise<Track | Object> {
    const user = await this.userModel.findOne({ _id: userId }); // find user for checking of memory  available
    if (user.usedSpace + audio.size > user.diskSpace) {
      return { message: 'There is no space on the disk' };
    }
    user.usedSpace += audio.size;
    await user.save();
    const audioPath = this.fileService.createFile(FileType.AUDIO, audio);
    const album = await this.albumModel.findById(dto.albumId);
    const track = await this.trackModel.create({
      ...dto,
      listens: 0,
      audio: audioPath,
      picture: picturePath,
      size: audio.size,
    });
    album.tracks.push(track._id);
    await album.save();
    return track;
  }

  async getAll(
    count = 10,
    offset = 0,
    albumId = '',
  ): Promise<{
    tracks: Track[];
    album: Album;
    author: User;
    docCount: number;
  }> {
    const tracks = await this.trackModel
      .find({
        albumId: albumId,
      })
      .skip(offset)
      .limit(count);
    const album = await this.albumModel.findById(albumId);
    const user = await this.userModel.findById(album.authorId);
    const docCount = await this.trackModel
      .countDocuments({
        albumId: albumId,
      })
      .exec();
    return { tracks, album, author: user, docCount };
  }

  async search(
    count = 10,
    offset = 0,
    albumId = '',
    query = '',
  ): Promise<{
    tracks: Track[];
    album: Album;
    author: User;
    docCount: number;
  }> {
    const tracks = await this.trackModel
      .find({
        name: { $regex: new RegExp(query, 'i') },
        albumId: albumId,
      })
      .skip(offset)
      .limit(count);
    const album = await this.albumModel.findById(albumId);
    const user = await this.userModel.findById(album.authorId);
    const docCount = await this.trackModel
      .countDocuments({
        name: { $regex: new RegExp(query, 'i') },
        albumId: albumId,
      })
      .exec();
    return { tracks, album, author: user, docCount };
  }

  async searchAll(count = 5, offset = 0, query = ''): Promise<Track[]> {
    const tracks = await this.trackModel
      .find({
        name: { $regex: new RegExp(query, 'i') },
      })
      .skip(offset)
      .limit(count);
    return tracks;
  }

  async getOne(
    id: ObjectId,
  ): Promise<{ serverTrack: Track; album: Album; author: User }> {
    const track = await (
      await this.trackModel.findById(id)
    ).populate('comments'); // в ф-ции populate указываем что надо подтянуть в полном развернутом виде по _id. Здесь подтягиваем по _id комментов в архиве все полные комментарии ( с текстом, с именем юзера и т.д) т.к. в Shema Track в поле comments мы указали ref: 'Comment'

    const album = await this.albumModel.findById(track.albumId);
    const user = await this.userModel.findById(album.authorId);
    return { serverTrack: track, album: album, author: user };
  }

  async delete(id: ObjectId): Promise<Types.ObjectId> {
    const track = await this.trackModel.findByIdAndDelete(id);
    const album = await this.albumModel.findById(track.albumId);
    const user = await this.userModel.findById(album.authorId);
    user.usedSpace -= track.size;
    await user.save();
    return track._id;
  }

  async download(id: ObjectId): Promise<any> {
    try {
      const track = await this.trackModel.findById(id);
      const pathAudio =
        path.resolve(__dirname, '../../', 'static') + path.sep + track.audio;

      if (fs.existsSync(pathAudio)) {
        return { pathAudio, audioName: track.name };
      }
      return { message: 'Download error' };
    } catch (error) {
      console.log(error);
    }
  }

  async addComment(dto: CreateCommentDto): Promise<Comment> {
    const track = await this.trackModel.findById(dto.trackId);
    const comment = await this.commentModel.create({ ...dto });
    track.comments.push(comment._id);
    await track.save();
    return comment;
  }

  async listen(id: ObjectId) {
    const track = await this.trackModel.findById(id);
    track.listens += 1;
    track.save();
    return track;
  }
}

@Injectable()
export class SharpPipeTrackService
  implements PipeTransform<Express.Multer.File, Promise<string>>
{
  async transform(image: Express.Multer.File): Promise<string> {
    const fileExtension = image.originalname.split('.').pop();
    const fileName = uuid.v4() + '.' + fileExtension;
    const filePath = path.resolve(__dirname, '..', '..', 'static', 'image');

    await sharp(image.buffer)
      .resize(300)
      .toFile(path.resolve(filePath, fileName));

    return 'image/' + fileName;
  }
}