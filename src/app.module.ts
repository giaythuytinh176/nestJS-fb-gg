import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import * as dotenv from 'dotenv';
import { AuthModule } from './modules/auth/auth.module';
import { checkUserMiddleware } from './modules/auth/checkUser.middleware';

dotenv.config();

@Module({
  imports: [
    AuthModule,
    UserModule,
    MongooseModule.forRoot(process.env.MONGODB_CONNECTION_STRING),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
