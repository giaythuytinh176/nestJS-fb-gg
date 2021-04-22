import {
  Body,
  Controller,
  Get,
  Header,
  HttpStatus,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { tokenDTO } from './dto/token.dto';
import { CreateUserDTO } from '../user/dto/create-user.dto';
import { IUser } from '../user/interfaces/user.interface';

@ApiBearerAuth()
@ApiTags('users')
@Controller('auth')
// load HttpExceptionFilter
// @UseFilters(HttpExceptionFilter)
export class AuthController {
  private logger = new Logger('UsersController');

  constructor(private readonly authService: AuthService) {}

  @Post('local/signup')
  @ApiOperation({ summary: 'Create user' })
  @ApiBody({ type: CreateUserDTO })
  @ApiOkResponse({ type: tokenDTO })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 422, description: 'Entity Validation Error.' })
  signUp(@Body() createUserDto: CreateUserDTO): Promise<tokenDTO> {
    return this.authService.signUp(createUserDto);
  }

  @Get('/facebook')
  @ApiResponse({
    status: 500,
    description: 'This authorization code has been used.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('/facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginRedirect(@Req() req: any): Promise<any> {
    return {
      statusCode: HttpStatus.OK,
      data: req.user,
    };
  }

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    return;
  }

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }
}
