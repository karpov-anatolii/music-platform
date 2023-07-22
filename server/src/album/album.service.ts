import { Injectable, PipeTransform } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ObjectId } from 'mongoose';
import { FileService, FileType } from 'src/file/file.service';
import { CreateAlbumDto } from 'src/track/dto/create-album.dto';
import { Album, AlbumDocument } from 'src/track/schemas/album.schema';
import { Comment, CommentDocument } from 'src/track/schemas/comment.schema';
import { Track, TrackDocument } from 'src/track/schemas/track.schema';
import { User, UserDocument } from 'src/track/schemas/user.schema';
import * as path from 'path';
import * as uuid from 'uuid';
const sharp = require('sharp');

@Injectable()
export class AlbumService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private fileService: FileService,
  ) {}

  async create(
    dto: CreateAlbumDto,
    picturePath: string,
    userId: string,
  ): Promise<Album> {
    const user = await this.userModel.findOne({ _id: userId });
    const album = await this.albumModel.create({
      ...dto,
      picture: picturePath,
    });
    user.albums.push(album._id);
    await user.save();
    return album;
  }

  async getAll(
    count = 10,
    offset = 0,
    userId: ObjectId | string,
  ): Promise<{ albums: Album[]; docCount: number }> {
    let albums: Album[];
    let docCount: number;
    if (userId != 'all') {
      albums = await this.albumModel
        .find({
          authorId: userId,
        })
        .skip(offset)
        .limit(count);
      docCount = await this.albumModel
        .countDocuments({
          authorId: userId,
        })
        .exec();
    } else {
      albums = await this.albumModel.find().skip(offset).limit(count);
      docCount = await this.albumModel.countDocuments().exec();
    }

    return { albums, docCount };
  }

  async getOne(id: ObjectId): Promise<Album> {
    const album = await (await this.albumModel.findById(id)).populate('tracks'); // в ф-ции populate указываем что надо подтянуть в полном развернутом виде по _id. Здесь подтягиваем по _id комментов в архиве все полные комментарии ( с текстом, с именем юзера и т.д) т.к. в Shema Track в поле comments мы указали ref: 'Comment'
    return album;
  }

  async delete(id: ObjectId, userId: ObjectId): Promise<Album> {
    const album = await this.albumModel.findByIdAndDelete(id);

    this.fileService.removeFile(album.picture);
    let fullSize = 0;
    for (let trackId of album.tracks) {
      const track = await this.trackModel.findByIdAndDelete(trackId);
      this.fileService.removeFile(track.picture);
      this.fileService.removeFile(track.audio);
      fullSize += track.size;
      for (let commentId of track.comments) {
        const comment = await this.commentModel.findByIdAndDelete(commentId);
      }
    }
    const newUser = await this.userModel.findOneAndUpdate(
      { _id: userId },
      { $pull: { albums: album._id }, $inc: { usedSpace: -fullSize } },
      {
        new: true,
      },
    );

    return album;
  }
}

@Injectable()
export class SharpPipeAlbumService
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
