import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { authUserSchema } from '../../user/joi/auth-user.joi';

@Injectable()
export class bodyValidatorMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');

    const schema = authUserSchema;

    const result = schema.validate(req.body);

    if (result.error) {
      const errorMessage = result.error.details.shift().message;
      const message: string = errorMessage.replace(/["]/g, '');

      return next(new BadRequestException(`Validation failed: ${message}`));
    }

    next();
  }
}
