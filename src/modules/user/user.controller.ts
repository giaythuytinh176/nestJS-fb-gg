import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IUser } from './interfaces/user.interface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  private logger = new Logger('UsersController');

  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
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
}
