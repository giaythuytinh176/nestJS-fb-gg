import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { sign } from 'jsonwebtoken';
import { Model } from 'mongoose';
import { USER_MODEL_TOKEN } from '../../server.constants';
import { IUser } from '../user/interfaces/user.interface';
import { IToken } from './interfaces/token.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(USER_MODEL_TOKEN) private readonly userModel: Model<IUser>,
  ) {}

  async createToken(user: any): Promise<IToken> {
    const expiresIn: string = '48h';
    const token: string = sign(
      {
        sub: user.id,
      },
      process.env.jwtSecret,
      { expiresIn },
    );

    return {
      token,
    };
  }

  async findUserById(id: string): Promise<IUser> {
    return await this.userModel.findById(id);
  }

  googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }

    return {
      message: 'User information from google',
      user: req.user,
    };
  }
}