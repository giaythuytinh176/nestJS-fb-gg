import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AuthController } from "./auth/auth.controller";
import { AuthModule } from "./auth/auth.module";
import { LoggerMiddleware } from "./middleware/logger.middleware";

@Module({
  imports: [AuthModule],
  controllers: [],
  providers: []
})
export class AppModule implements NestModule {
  // constructor(private connection: Connection) {}
  async configure(consumer: MiddlewareConsumer) {
      await consumer
        .apply(LoggerMiddleware)
        // .forRoutes('tasks');
       // .forRoutes({ path: 'tasks', method: RequestMethod.POST });
      //  .exclude(
      //     { path: 'tasks', method: RequestMethod.GET },
      //     { path: 'tasks', method: RequestMethod.POST },
      //     // 'tasks/(.*)', 
      //   )
       .forRoutes(AuthController);
 }
}
