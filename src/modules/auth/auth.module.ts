import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import * as passport from 'passport';
import { authenticate } from 'passport';
import { USER_MODEL_TOKEN } from '../../server.constants';
import { UserSchema } from '../user/schemas/user.schema';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { bodyValidatorMiddleware } from './middlewares/body-validator.middleware';
import { FacebookStrategy } from './passport/facebook.strategy';
import { GoogleStrategy } from './passport/google.strategy';
import { JwtStrategy } from './passport/jwt.strategy';
import { LocalStrategy } from './passport/local.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: USER_MODEL_TOKEN, schema: UserSchema }]),
    // configure default options for passport
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    FacebookStrategy,
    GoogleStrategy,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [],
})
export class AuthModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        bodyValidatorMiddleware,
        authenticate('local-signup', { session: false }),
      )
      .forRoutes({ path: 'auth/local/signup', method: RequestMethod.POST });

    // // google Login
    // consumer
    //   .apply(
    //     passport.authenticate('google', {
    //       scope: [
    //         'https://www.googleapis.com/auth/userinfo.profile',
    //         'https://www.googleapis.com/auth/userinfo.email',
    //       ],
    //     }),
    //   )
    //   .forRoutes({ path: '/auth/google', method: RequestMethod.GET })
    //   // google CallBack URL
    //   .apply(
    //     passport.authenticate('google', {
    //       session: false,
    //       successRedirect: '/user',
    //       failureRedirect: '/error',
    //     }),
    //   )
    //   .forRoutes({ path: '/auth/google/callback', method: RequestMethod.GET });
    // //
    // //
    // // facebook Login
    // consumer
    //   .apply(
    //     passport.authenticate('facebook', {
    //       scope: ['email'],
    //     }),
    //   )
    //   .forRoutes({ path: '/auth/facebook', method: RequestMethod.ALL })
    //   // facebook callback
    //   .apply(
    //     passport.authenticate('facebook', {
    //       session: false,
    //       successRedirect: '/user',
    //       failureRedirect: '/error',
    //     }),
    //   )
    //   .forRoutes({
    //     path: '/auth/facebook/callback',
    //     method: RequestMethod.ALL,
    //   });
  }
}
