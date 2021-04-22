import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import * as dotenv from 'dotenv';
import { AuthModule } from './modules/auth/auth.module';
import { ConsoleModule } from 'nestjs-console';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

dotenv.config();

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    ConsoleModule,
    AuthModule,
    UserModule,
    MongooseModule.forRoot(process.env.MONGODB_CONNECTION_STRING),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
