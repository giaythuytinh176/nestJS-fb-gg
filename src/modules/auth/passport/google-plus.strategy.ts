import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { use } from 'passport';

import { USER_MODEL_TOKEN } from '../../../server.constants';
import { IUser } from '../../user/interfaces/user.interface';

const GoogleTokenStrategy = require('passport-google-plus-token');

@Injectable()
export class GoogleStrategy1 {
  constructor(
    @InjectModel(USER_MODEL_TOKEN) private readonly userModel: Model<IUser>,
  ) {
    this.init();
  }

  private init(): void {
    use(
      'google1',
      new GoogleTokenStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_SECRET,
        },
        async (
          accessToken: string,
          refreshToken: string,
          profile: any,
          done: Function,
        ) => {
          try {
            const existingUser: IUser = await this.userModel.findOne({
              'google.id': profile.id,
            });

            if (existingUser) {
              return done(null, existingUser);
            }

            const { id, displayName } = profile;
            const email: string = profile.emails.shift().value;
            const user: IUser = new this.userModel({
              method: 'google',
              google: {
                id,
                email,
                displayName,
              },
            });

            done(null, await user.save());
          } catch (err) {
            done(err, null);
          }
        },
      ),
    );
  }
}
