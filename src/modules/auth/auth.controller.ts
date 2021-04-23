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
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { tokenDTO } from './dto/token.dto';
import { CreateUserDTO } from '../user/dto/create-user.dto';
import { IToken } from './interfaces/token.interface';
import { Request } from 'express';

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

  // @Get('/facebook/callback')
  // @ApiExcludeEndpoint()
  // @UseGuards(AuthGuard('facebook'))
  // async facebookLoginRedirect(@Req() req: any): Promise<any> {
  //   return {
  //     statusCode: HttpStatus.OK,
  //     data: req.user,
  //   };
  // }

  @Get('google/uri')
  // @ApiExcludeEndpoint()
  // @UseGuards(AuthGuard('google'))
  async googleAuth() {
    const queryParams: string[] = [
      `client_id=${process.env.GOOGLE_CLIENT_ID}`,
      `redirect_uri=${process.env.redirect_uri}`,
      `response_type=code`,
      //`scope=https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.profile.emails.read`,
      //`scope=openid`,
      `scope=https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email`,
    ];
    const redirect_uri = `https://accounts.google.com/o/oauth2/auth?${queryParams.join(
      '&',
    )}`;
    return {
      redirect_uri,
    };
  }

  @Post('google/signin')
  async googleSignIn(@Req() req: any): Promise<any> {
    return await this.authService.googleSignIn(req.body.code);
  }

  @Post('google/token')
  async requestJsonWebTokenAfterGoogleSignIn(@Req() req: any): Promise<IToken> {
    return await this.authService.createToken(req.body.user);
  }

  @Get('facebook/uri')
  // @ApiExcludeEndpoint()
  // @ApiResponse({
  //   status: 500,
  //   description: 'This authorization code has been used.',
  // })
  // @ApiResponse({ status: 403, description: 'Forbidden.' })
  // @ApiResponse({ status: 404, description: 'Not Found.' })
  async requestFacebookRedirectUrl(): Promise<{ redirect_uri: string }> {
    const queryParams: string[] = [
      `client_id=${process.env.FACEBOOK_APP_ID}`,
      `redirect_uri=${process.env.redirect_uri}`,
      `state={fbstate}`,
    ];
    const redirect_uri: string = `https://www.facebook.com/v10.0/dialog/oauth?${queryParams.join(
      '&',
    )}`;
    return {
      redirect_uri,
    };
  }

  @Post('facebook/signin')
  async facebookSignIn(@Req() req: Request): Promise<IToken> {
    return await this.authService.facebookSignIn(req.body.code);
  }

  @Post('facebook/token')
  // @UseGuards(AuthGuard('facebook'))
  async requestJsonWebTokenAfterFacebookSignIn(
    @Req() req: any,
  ): Promise<IToken> {
    return await this.authService.createToken(req.body.user);
  }
}
