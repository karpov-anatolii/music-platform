import {
  Controller,
  Get,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Post } from '@nestjs/common/decorators/http/request-mapping.decorator';
import {
  Body,
  Headers,
  Query,
  UploadedFile,
} from '@nestjs/common/decorators/http/route-params.decorator';
import { AlbumService, SharpPipeAlbumService } from './album.service';
import { ObjectId } from 'mongoose';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { CreateAlbumDto } from 'src/track/dto/create-album.dto';
import { UserId } from 'src/middleware/token.decorator';

@Controller('/albums')
export class AlbumController {
  constructor(
    private albumService: AlbumService,
    private sharpPipeService: SharpPipeAlbumService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('picture'))
  async create(
    @Body() dto: CreateAlbumDto,
    @UserId() userId: string,
    @UploadedFile() image?: Express.Multer.File,
    // @Headers('Authorization') headers: string,
  ) {
    if (!userId) {
      throw new HttpException('No auth token', HttpStatus.UNAUTHORIZED);
    }
    let picturePath: string;
    if (image) picturePath = await this.sharpPipeService.transform(image);
    return this.albumService.create(dto, picturePath, userId);
  }

  @Get()
  getAll(
    @Query('count') count: number,
    @Query('offset') offset: number,
    @Query('userId') userId: ObjectId | string,
  ) {
    return this.albumService.getAll(count, offset, userId);
  }

  @Get(':id')
  getOne(@Param('id') id: ObjectId) {
    return this.albumService.getOne(id);
  }

  @Delete(':id')
  delete(@Param('id') id: ObjectId, @UserId() userId: ObjectId) {
    if (!userId) {
      throw new HttpException('No auth token', HttpStatus.UNAUTHORIZED);
    }
    return this.albumService.delete(id, userId);
  }
}
