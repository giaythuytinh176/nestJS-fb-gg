import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as passport from 'passport';
import { USER_MODEL_TOKEN } from '../../server.constants';
import { UserSchema } from '../user/schemas/user.schema';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FacebookStrategy } from './passport/facebook.strategy';
import { GoogleStrategy } from './passport/google.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: USER_MODEL_TOKEN, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, FacebookStrategy, GoogleStrategy],
  exports: [],
})
export class AuthModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer

      // google Login
      .apply(
        passport.authenticate('google', {
          scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
          ],
        }),
      )
      .forRoutes({ path: '/auth/google', method: RequestMethod.GET })
      // google CallBack URL
      .apply(
        passport.authenticate('google', {
          successRedirect: '/user',
          failureRedirect: '/error',
        }),
      )
      .forRoutes({ path: '/auth/google/callback', method: RequestMethod.GET })

      //
      //
      // facebook Login
      .apply(
        passport.authenticate('facebook', {
          scope: ['email'],
        }),
      )
      .forRoutes({ path: '/auth/facebook', method: RequestMethod.ALL })
      // facebook callback
      .apply(
        passport.authenticate('facebook', {
          successRedirect: '/user',
          failureRedirect: '/error',
        }),
      )
      .forRoutes({
        path: '/auth/facebook/callback',
        method: RequestMethod.ALL,
      });
  }
}
