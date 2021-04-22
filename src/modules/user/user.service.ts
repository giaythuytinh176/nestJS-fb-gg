import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { USER_MODEL_TOKEN } from '../../server.constants';
import { IUser } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(USER_MODEL_TOKEN) private readonly userModel: Model<IUser>,
  ) {}

  async getUserByEmail(email: string): Promise<IUser> {
    return await this.userModel.findOne({
      where: { email },
    });
  }

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
