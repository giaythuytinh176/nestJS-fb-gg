import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { USER_MODEL_TOKEN } from '../../../server.constants';
import { Model } from 'mongoose';
import { IUser } from '../../user/interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @InjectModel(USER_MODEL_TOKEN) private readonly userModel: Model<IUser>,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: 'http://localhost:4200/recipes',
      // passReqToCallback: true,
      scope: ['email', 'profile'],
      prompt: 'select_account',
      accessType: 'offline',
      includeGrantedScopes: true,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    console.log('xxx', profile);
    const existingUser: IUser = await this.userModel.findOne({
      'google.id': profile.id,
    });

    if (existingUser) {
      return existingUser;
    }

    try {
      const user: IUser = new this.userModel({
        method: 'google',
        google: {
          id: profile.id,
          email: profile.emails ? profile.emails[0].value : undefined,
          displayName: profile.displayName,
          token: accessToken,
        },
      });

      return await user.save();
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }
}
