import { Injectable, NestMiddleware } from '@nestjs/common';
import { MiddlewareBuilder } from '@nestjs/core';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class checkUserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    // console.log('req.user', req);
    if (!req.user) {
      res.redirect('/home');
    }
    next();
  }
}
