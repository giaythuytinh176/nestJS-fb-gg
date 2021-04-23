import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Profile, Strategy } from 'passport-facebook';
import { USER_MODEL_TOKEN } from '../../../server.constants';
import { IUser } from '../../user/interfaces/user.interface';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    @InjectModel(USER_MODEL_TOKEN) private readonly userModel: Model<IUser>,
  ) {
    super({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: 'http://localhost:4200/recipes',
      scope: 'email',
      profileFields: ['emails', 'name', 'id', 'displayName', 'photos'],
      enableProof: true,
      // passReqToCallback: true,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const existingUser: IUser = await this.userModel.findOne({
      'facebook.id': profile.id,
    });

    if (existingUser) {
      return done(null, existingUser);
    }

    try {
      const user: IUser = new this.userModel({
        method: 'facebook',
        facebook: {
          email: profile.emails ? profile.emails[0].value : undefined,
          id: profile.id,
          displayName:
            (profile.name.givenName ?? '') +
            ' ' +
            (profile.name.familyName ?? ''),
          token: accessToken,
        },
      });

      done(null, await user.save());
    } catch (err) {
      done(err, null);
    }
  }
}
