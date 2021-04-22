import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Command, ConsoleService } from 'nestjs-console';
import {
  generateHashedPassword,
  generateSalt,
} from '../../utilities/encryption';
import { MESSAGES, USER_MODEL_TOKEN } from '../../server.constants';
import { CreateUserDTO } from './dto/create-user.dto';
import { IUser } from './interfaces/user.interface';
import commander from 'commander';
import { authUserSchema } from './joi/auth-user.joi';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(USER_MODEL_TOKEN) private readonly userModel: Model<IUser>,
  ) {}

  async getUsers(): Promise<IUser[]> {
    return this.userModel.aggregate([
      {
        $project: {
          _id: 0,
          email_local: '$local.email',
          email_google: '$google.email',
          email_facebook: '$facebook.email',
        },
      },
    ]);
    // return this.userModel.find(
    //   {},
    //   {
    //     method: 1,
    //     email: 1,
    //     'local.email': 1,
    //     'facebook.email': 1,
    //     'google.email': 1,
    //   },
    // );
  }
}
