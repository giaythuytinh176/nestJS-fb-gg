import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConsoleModule } from 'nestjs-console';
import { USER_MODEL_TOKEN } from '../../server.constants';
import { checkUserMiddleware } from '../auth/middlewares/checkUser.middleware';
import { UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    ConsoleModule,
    MongooseModule.forFeature([{ name: USER_MODEL_TOKEN, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer
    //   .apply(checkUserMiddleware)
    //   .forRoutes({ path: '/user', method: RequestMethod.ALL });
  }
}
