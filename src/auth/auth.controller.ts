import { Controller, Get, HttpStatus, Req, UseFilters, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { HttpExceptionFilter } from "../ExceptionFilters/http-exception.filter";
import { AuthService } from "./auth.service";
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';

@Controller("auth")
// load HttpExceptionFilter
// @UseFilters(HttpExceptionFilter)
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {
    }

    @Get("/facebook")
    @ApiResponse({ status: 500, description: 'This authorization code has been used.'})
    @UseGuards(AuthGuard("facebook"))
    async facebookLogin(): Promise<any> {
        return HttpStatus.OK;
    }

    @Get("/facebook/callback")
    @UseGuards(AuthGuard("facebook"))
    async facebookLoginRedirect(@Req() req: any): Promise<any> {
        return {
            statusCode: HttpStatus.OK,
            data: req.user
        };
    }

    @Get("/google")
    @UseGuards(AuthGuard("google"))
    async googleAuth(@Req() req) {
    }

    @Get("/google/callback")
    @UseGuards(AuthGuard("google"))
    googleAuthRedirect(@Req() req) {
        return this.authService.googleLogin(req);
    }
}
