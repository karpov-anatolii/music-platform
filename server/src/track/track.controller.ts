import {
  Controller,
  Get,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  HttpException,
  HttpStatus,
  StreamableFile,
} from '@nestjs/common';
import { Post } from '@nestjs/common/decorators/http/request-mapping.decorator';
import {
  Body,
  Query,
  Res,
  UploadedFile,
} from '@nestjs/common/decorators/http/route-params.decorator';
import { SharpPipeTrackService, TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { ObjectId } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { UserId } from 'src/middleware/token.decorator';
import { Response } from 'express';
import { createReadStream } from 'fs';

@Controller('/tracks')
export class TrackController {
  constructor(
    private trackService: TrackService,
    private sharpPipeService: SharpPipeTrackService,
  ) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'picture', maxCount: 1 },
      { name: 'audio', maxCount: 1 },
    ]),
  )
  async create(
    // @UploadedFiles() files,
    @UploadedFiles()
    files: { picture?: Express.Multer.File; audio: Express.Multer.File },
    @Body() dto: CreateTrackDto,
    @UserId() userId: string,
  ) {
    if (!userId) {
      throw new HttpException('No auth token', HttpStatus.UNAUTHORIZED);
    }
    const { picture, audio } = files;
    console.log('Picture=', picture);
    let picturePath: string;
    if (picture)
      picturePath = await this.sharpPipeService.transform(picture[0]);

    return this.trackService.create(dto, picturePath, audio[0], userId);
  }

  // @Post()
  // @UseInterceptors(FileFieldsInterceptor([{ name: 'audio', maxCount: 1 }]))
  // @UseInterceptors(FileInterceptor('picture'))
  // async create(
  //   @UploadedFiles() files,
  //   @UploadedFile() image: Express.Multer.File,
  //   @Body() dto: CreateTrackDto,
  //   @UserId() userId: string,
  // ) {
  //   if (!userId) {
  //     throw new HttpException('No auth token', HttpStatus.UNAUTHORIZED);
  //   }
  //   console.log('START userId=', userId);

  //   const { audio } = files;
  //   const picturePath = await this.sharpPipeService.transform(image);
  //   return this.trackService.create(dto, picturePath, audio[0], userId);
  // }

  @Get()
  async getAll(
    @Query('count') count: number,
    @Query('offset') offset: number,
    @Query('albumId') albumId: string,
  ) {
    const { tracks, album, author, docCount } = await this.trackService.getAll(
      count,
      offset,
      albumId,
    );
    return { tracks, album, author, docCount };
  }

  @Get('/search')
  async search(
    @Query('count') count: number,
    @Query('offset') offset: number,
    @Query('albumId') albumId: string,
    @Query('query') query: string,
  ) {
    return await this.trackService.search(count, offset, albumId, query);
  }

  @Get('/search-all')
  async searchAll(
    @Query('count') count: number,
    @Query('offset') offset: number,
    @Query('query') query: string,
  ) {
    return await this.trackService.searchAll(count, offset, query);
  }

  @Get(':id')
  getOne(@Param('id') id: ObjectId) {
    return this.trackService.getOne(id);
  }

  @Delete(':id')
  delete(@Param('id') id: ObjectId, @UserId() userId: ObjectId) {
    if (!userId) {
      throw new HttpException('No auth token', HttpStatus.UNAUTHORIZED);
    }
    return this.trackService.delete(id);
  }

  @Get('/download/:id')
  async download(
    @Param('id') id: ObjectId,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const { pathAudio, audioName, message } = await this.trackService.download(
      id,
    );
    if (!message && pathAudio) {
      const file = createReadStream(pathAudio);
      res.set({
        'Content-Type':
          'audio/mpeg;audio/x-mpeg;audio/mpeg3;audio/x-mpeg-3; charset=binary',
        'Content-Disposition': `attachment; filename="my_mp3_filename.MP3"`,
      });
      return new StreamableFile(file);
    } else {
      return message;
    }
  }

  @Post('/comment')
  addComment(@Body() dto: CreateCommentDto) {
    return this.trackService.addComment(dto);
  }

  @Post('/listen/:id')
  listen(@Param('id') id: ObjectId) {
    return this.trackService.listen(id);
  }
}
