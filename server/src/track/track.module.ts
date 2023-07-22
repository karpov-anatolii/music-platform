import { Module } from '@nestjs/common';
import { Track, TrackSchema } from './schemas/track.schema';
import { TrackController } from './track.controller';
import { SharpPipeTrackService, TrackService } from './track.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { FileService } from 'src/file/file.service';
import { Album, AlbumSchema } from './schemas/album.schema';
import { User, UserSchema } from './schemas/user.schema';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(),
    }), // importing MulterModule and use memory storage to use the buffer for resizing images via sharp
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Album.name, schema: AlbumSchema }]),
    MongooseModule.forFeature([{ name: Track.name, schema: TrackSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
  ],
  controllers: [TrackController],
  providers: [TrackService, FileService, SharpPipeTrackService],
})
export class TrackModule {}
