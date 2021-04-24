import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { authenticate } from 'passport';
import { USER_MODEL_TOKEN } from '../../server.constants';
import { UserSchema } from '../user/schemas/user.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { bodyValidatorMiddleware } from './middlewares/body-validator.middleware';
import { FacebookStrategy } from './passport/facebook.strategy';
import { GoogleStrategy } from './passport/google.strategy';
import { JwtStrategy } from './passport/jwt-strategy';
import { JwtModule } from '@nestjs/jwt';
import { GoogleStrategy1 } from './passport/google-plus.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: USER_MODEL_TOKEN, schema: UserSchema }]),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    FacebookStrategy,
    GoogleStrategy,
    JwtStrategy,
    GoogleStrategy1,
  ],
  exports: [AuthService],
})
export class AuthModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(bodyValidatorMiddleware)
      .forRoutes({ path: 'auth/local/signup', method: RequestMethod.POST });

    // consumer
    // .apply(corsMiddleware)
    // .forRoutes({ path: 'auth/facebook', method: RequestMethod.GET })

    // consumer
    // .apply(corsMiddleware)
    // .forRoutes({ path: 'auth/google', method: RequestMethod.GET });

    // consumer
    // .apply(authenticate('google', { session: false }))
    // .forRoutes('auth/google/token');
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
