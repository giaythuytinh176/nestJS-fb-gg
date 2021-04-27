import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Db } from 'mongodb';
import { Model } from 'mongoose';
import { DATABASE_CONNECTION, USER_MODEL_TOKEN } from '../../server.constants';
import { IUser } from './interfaces/user.interface';

@Injectable()
export class UserService {
  dbconnect: any;

  constructor(
    @InjectModel(USER_MODEL_TOKEN) private readonly userModel: Model<IUser>,
    @Inject(DATABASE_CONNECTION) private db: Db,
  ) {
    this.dbconnect = db.collection('users_mongodb');
  }

  async getUserByEmail(email: string): Promise<IUser> {
    return await this.dbconnect.findOne({
      where: { email },
    });
  }

  async getUsers(): Promise<IUser[]> {
    return this.dbconnect.find();
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
