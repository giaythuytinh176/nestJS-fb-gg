import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { USER_MODEL_TOKEN } from '../../../server.constants';
import { Model } from 'mongoose';
import { IUser } from '../../user/interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import * as passport from 'passport';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @InjectModel(USER_MODEL_TOKEN) private readonly userModel: Model<IUser>,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK,
      // passReqToCallback: true,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const existingUser: IUser = await this.userModel.findOne({
        'google.id': profile.id,
      });

      if (existingUser) {
        return done(null, existingUser);
      }

      const user: IUser = new this.userModel({
        method: 'google',
        roles: ['user'],
        google: {
          id: profile.id,
          email: profile.emails ? profile.emails[0].value : undefined,
          displayName: profile.displayName,
          token: accessToken,
        },
      });

      done(null, await user.save());
    } catch (err) {
      done(err, null);
    }
  }
}
