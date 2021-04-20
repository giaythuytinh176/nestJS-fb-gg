import {
  Body,
  Controller,
  Get,
  Logger,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDTO } from './dto/create-user.dto';
import { IUser } from './interfaces/user.interface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  private logger = new Logger('UsersController');

  constructor(
    private readonly userService: UserService
    ) {}

  @Get()
  @ApiOperation({ summary: 'Get All Users' })
  @ApiResponse({
    status: 200,
    description: 'The records has been successfully queried.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  getUsers(): Promise<IUser[]> {
    this.logger.verbose(`retrieving all users.`);
    return this.userService.getUsers();
  }

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
