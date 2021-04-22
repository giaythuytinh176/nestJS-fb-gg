import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';
import { IUser } from 'src/modules/user/interfaces/user.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.jwtSecret,
    });
  }

  async validate(payload: IJwtPayload, done: VerifiedCallback) {
    const user: IUser = await this.authService.findUserById(payload.sub);
    if (!user) {
      return done(new HttpException({}, HttpStatus.UNAUTHORIZED), false);
    }

    return done(null, user, payload.iat);
  }
}
