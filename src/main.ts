import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { Logger, ValidationPipe } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as compression from 'compression';
import * as cors from 'cors';

dotenv.config();
declare const module: any;

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  // // somewhere in your initialization file
  // app.use(cookieParser());

  // // somewhere in your initialization file
  // app.use(
  //   session({
  //     secret: 'my-secret-Tam-le-opentechiz',
  //     resave: false,
  //     saveUninitialized: false,
  //   }),
  // );
  // app.use(passport.initialize());
  // app.use(passport.session());
  app.use(cors()); // Use this after the variable declaration

  app.use(compression());

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  // app.useGlobalFilters(new DispatchError());

  const config = new DocumentBuilder()
    .setTitle('API Login')
    .setDescription('Simple login Facebook Google')
    .setVersion('1.0')
    .addTag('users')
    .addBearerAuth()
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
