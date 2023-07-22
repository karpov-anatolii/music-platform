import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AlbumController } from 'src/album/album.controller';
import { AlbumService } from 'src/album/album.service';
import { FileService } from 'src/file/file.service';
import { Album, AlbumSchema } from 'src/track/schemas/album.schema';
import { Comment, CommentSchema } from 'src/track/schemas/comment.schema';
import { Track, TrackSchema } from 'src/track/schemas/track.schema';
import { User, UserSchema } from 'src/track/schemas/user.schema';
import { TrackController } from 'src/track/track.controller';
import { TrackService } from 'src/track/track.service';
import { UserController } from './user.controller';
import { SharpPipeUserService, UserService } from './user.service';

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(),
    }), // importing MulterModule and use memory storage to use the buffer for resizing images via sharp
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    // MongooseModule.forFeature([{ name: Album.name, schema: AlbumSchema }]),
    // MongooseModule.forFeature([{ name: Track.name, schema: TrackSchema }]),
    // MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, FileService, SharpPipeUserService],
})
export class UserModule {}
