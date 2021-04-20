import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { USER_MODEL_TOKEN } from '../../server.constants';
import { IUser } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(USER_MODEL_TOKEN) private readonly userModel: Model<IUser>,
  ) {}

  async getUsers(): Promise<IUser[]> {
    return this.userModel.find(
      {},
      { method: 1, 'local.email': 1, 'facebook.email': 1, 'google.email': 1 },
    );
  }
}
