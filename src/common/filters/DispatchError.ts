import {ArgumentsHost, Catch, ExceptionFilter, HttpStatus, UnauthorizedException} from '@nestjs/common';
import { AppError } from '../error/AppError';

@Catch()
export class DispatchError implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost): any {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse();
console.log('xxx', exception);
console.log(11);
        if (exception instanceof AppError) {
            return res.status(exception.httpStatus).json({
                errorCode: exception.errorCode,
                errorMsg: exception.errorMessage,
                usrMsg: exception.userMessage,
                httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
            });
        } else if (
            exception.type == 'OAuthException' ||
            exception.code == 'invalid_grant'
        ) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                errorCode: exception.code,
                errorMsg: exception.message,
                // usrMsg: exception.type,
                httpCode: exception.status,
            });
        } else if (exception instanceof UnauthorizedException) {
            console.log(exception.message);
            console.error(exception.stack);
            return res.status(HttpStatus.UNAUTHORIZED).json(exception.message);
        } else if (exception.status === 403) {
            return res.status(HttpStatus.FORBIDDEN).json(exception.message);
        }

        else {
            console.error(exception.message);
            console.error(exception.stack);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
        }
    }

}