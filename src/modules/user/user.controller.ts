import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from '../../common/guards/authenticated.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @UseGuards(AuthenticatedGuard)
  // @Get('/home')
  // getHome(@Request() req) {
  //   return { user: req.user };
  // }

  // @UseGuards(AuthenticatedGuard)
  // @Get('/profile')
  // getProfile(@Request() req) {
  //   return { user: req.user };
  // }
}
