import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class checkUserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    // console.log('req.user', req);
    if (!req.user) {
      throw new UnauthorizedException();
      // res.redirect('/home');
    }
    next();
  }
}
