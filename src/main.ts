import { AppModule } from "./app.module";
import { NestFactory } from "@nestjs/core";
import * as dotenv from "dotenv";
import { Logger } from "@nestjs/common";
import { DispatchError } from "./common/filters/DispatchError";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

dotenv.config();

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new DispatchError());

  app.useGlobalFilters(new DispatchError());

  const options = new DocumentBuilder()
        .setTitle('User Login FBGG Application')
        .setDescription('APIs for the User Login FBGG')
        .setVersion('1.0')
        .addTag('nestjs')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
        .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}

bootstrap();
