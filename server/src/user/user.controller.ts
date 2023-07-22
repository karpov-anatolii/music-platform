import {
  Controller,
  Get,
  Param,
  Delete,
  UseInterceptors,
  HttpException,
  HttpStatus,
  NotFoundException,
  UsePipes,
} from '@nestjs/common';
import { Post } from '@nestjs/common/decorators/http/request-mapping.decorator';
import {
  Body,
  Headers,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common/decorators/http/route-params.decorator';
import { SharpPipeUserService, UserService } from './user.service';
import { ObjectId } from 'mongoose';
import { CreateUserDto } from 'src/track/dto/create-user.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { UserId } from 'src/middleware/token.decorator';
import { Request, Response } from 'express';
const config = require('config');

@Controller('/user')
export class UserController {
  constructor(
    private userService: UserService,
    private sharpPipeService: SharpPipeUserService,
  ) {}

  @Post('/registration')
  async create(
    @Res({ passthrough: true }) response: Response,
    @Body() dto: CreateUserDto,
  ): Promise<any> {
    const { token, user, error } = await this.userService.create(dto);
    const frontendDomain = config.get('FRONTEND_DOMAIN');
    response.cookie('token', token, {
      httpOnly: false,
      domain: frontendDomain,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });
    return { token, user, error };
  }

  @Post('/login')
  async getUser(
    @Body() dto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    const { token, user, error } = await this.userService.getUser(dto);
    const frontendDomain = config.get('FRONTEND_DOMAIN');
    response.cookie('token', token, {
      httpOnly: false,
      domain: frontendDomain,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });
    return { token, user, error };
  }

  @Get('/logout')
  async logout(@Res({ passthrough: true }) response: Response): Promise<any> {
    const frontendDomain = config.get('FRONTEND_DOMAIN');
    response.cookie('token', '', {
      httpOnly: false,
      domain: frontendDomain,
      sameSite: 'strict',
      maxAge: 0,
    });
    return { message: 'Logout' };
  }

  //  @Post('/login')
  //   getUser(@Body() dto: CreateUserDto) {
  //     // console.log('dto1======', dto);
  //     return this.userService.getUser(dto);
  //   }

  @Post('/avatar')
  @UseInterceptors(FileInterceptor('picture'))
  async uploadAvatar(
    @UploadedFile() image: Express.Multer.File,
    @Body() dto: { _id: string },
    @UserId() userId: string,
  ) {
    if (!userId) {
      throw new HttpException('No cookie token', HttpStatus.UNAUTHORIZED);
    }
    if (userId != dto._id) {
      throw new HttpException(
        "User's id doesn't match",
        HttpStatus.UNAUTHORIZED,
      );
    }
    const picturePath = await this.sharpPipeService.transform(image); // image/filename.jpg
    return this.userService.uploadAvatar(dto, picturePath);
  }

  @Delete('/avatar')
  deleteAvatar(@UserId() userId: ObjectId) {
    if (!userId) {
      throw new HttpException('No cookie token', HttpStatus.UNAUTHORIZED);
    }
    return this.userService.deleteAvatar(userId);
  }

  @Get('/auth')
  auth(@UserId() userId: ObjectId) {
    if (!userId) {
      throw new HttpException('No cookie token', HttpStatus.UNAUTHORIZED);
    }
    return this.userService.auth(userId);
  }

  @Get(':id')
  getOne(@Param('id') id: ObjectId, @UserId() userId: ObjectId) {
    if (!userId) {
      throw new HttpException('No cookie token', HttpStatus.UNAUTHORIZED);
    }
    return this.userService.getOne(id);
  }

  @Delete(':id')
  delete(@Param('id') id: ObjectId, @UserId() userId: ObjectId) {
    if (!userId) {
      throw new HttpException('No cookie token', HttpStatus.UNAUTHORIZED);
    }
    return this.userService.delete(id);
  }
}
