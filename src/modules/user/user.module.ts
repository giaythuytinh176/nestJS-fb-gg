import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConsoleModule } from 'nestjs-console';
import { USER_MODEL_TOKEN } from '../../server.constants';
import { UserConsole } from '../../console/user.console';
import { UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    ConsoleModule,
    MongooseModule.forFeature([{ name: USER_MODEL_TOKEN, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, UserConsole],
  exports: [],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply()
      .forRoutes({ path: '/user', method: RequestMethod.GET });
  }
}
