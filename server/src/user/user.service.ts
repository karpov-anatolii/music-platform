import {
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ObjectId } from 'mongoose';
import { FileService, FileType } from 'src/file/file.service';
import { CreateUserDto } from 'src/track/dto/create-user.dto';
import { User, UserDocument } from 'src/track/schemas/user.schema';
import * as path from 'path';
//import * as sharp from 'sharp';
import * as uuid from 'uuid';
const sharp = require('sharp');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private fileService: FileService,
  ) {}

  async auth(userId: ObjectId) {
    try {
      const user = await this.userModel
        .findOne({ _id: userId })
        .populate('albums');
      const token = jwt.sign({ _id: user._id }, config.get('secretKey'), {
        expiresIn: '1h',
      });
      return {
        token,
        user,
      };
    } catch (err) {
      console.log(err);
      throw new HttpException('Server Error', HttpStatus.FORBIDDEN);
    }
  }

  async create(dto: CreateUserDto): Promise<any> {
    const { name, email, password } = dto;
    const candidate = await this.userModel.findOne({ email });
    if (candidate) {
      return { error: { message: `User with email ${email} already exists` } };
    }
    const hashPassword = await bcrypt.hash(password, 8);
    const user = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      diskSpace: 1024 ** 3 / 10,
      usedSpace: 0,
      albums: [],
      picture: '',
    });
    await user.save();
    const token = jwt.sign({ _id: user._id }, config.get('secretKey'), {
      expiresIn: '1h',
    });
    return { user, token };
  }

  async getUser(dto: CreateUserDto): Promise<any> {
    const { email, password } = dto;
    const user = await this.userModel.findOne({ email }).populate('albums');
    if (!user) {
      return { error: { message: 'User not found' } };
    }
    const isPassValid = bcrypt.compareSync(password, user.password);
    if (!isPassValid) {
      return { error: { message: 'Invalid password' } };
    }
    const token = jwt.sign({ _id: user._id }, config.get('secretKey'), {
      expiresIn: '1h',
    });
    return {
      token,
      user,
    };
  }

  async getOne(id: ObjectId): Promise<User> {
    const user = await (await this.userModel.findById(id)).populate('albums'); // в ф-ции populate указываем что надо подтянуть в полном развернутом виде по _id. Здесь подтягиваем по _id альбомов в архиве все полные альбомы ( с названиями, с картинками и т.д)
    return user;
  }

  async delete(id: ObjectId): Promise<Types.ObjectId> {
    const user = await this.userModel.findByIdAndDelete(id).populate('albums');
    return user._id;
  }

  

  async uploadAvatar(dto: { _id: string }, picturePath: string): Promise<User> {
    const user = await this.userModel.findById(dto._id);
    user.picture = picturePath;
    await user.save();
    return user;
  }

  async deleteAvatar(userId: ObjectId): Promise<User | Object> {
    const { user, token } = await this.auth(userId);
    this.fileService.removeFile(user.picture);
    user.picture = '';
    await user.save();
    return user;
  }
}

@Injectable()
export class SharpPipeUserService
  implements PipeTransform<Express.Multer.File, Promise<string>>
{
  async transform(image: Express.Multer.File): Promise<string> {
    const fileExtension = image.originalname.split('.').pop();
    const fileName = uuid.v4() + '.' + fileExtension;
    const filePath = path.resolve(__dirname, '..', '..', 'static', 'image');

    await sharp(image.buffer)
      .resize(100)
      .toFile(path.resolve(filePath, fileName));

    return 'image/' + fileName;
  }
}
