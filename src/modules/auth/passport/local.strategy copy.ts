import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { Strategy } from 'passport-local';
import { IUser } from '../../user/interfaces/user.interface';
import {
  generateHashedPassword,
  generateSalt,
} from '../../../utilities/encryption';
import { MESSAGES, USER_MODEL_TOKEN } from '../../../server.constants';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local-signup') {
  constructor(
    @InjectModel(USER_MODEL_TOKEN) private readonly userModel: Model<IUser>,
  ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string) {
    email = email.toLowerCase();
    try {
      if (await this.userModel.findOne({ 'local.email': email })) {
        throw new UnauthorizedException(MESSAGES.UNAUTHORIZED_EMAIL_IN_USE);
      }

      const salt: string = generateSalt();
      const user: IUser = new this.userModel({
        method: 'local',
        local: {
          email,
          salt,
          hashedPassword: generateHashedPassword(salt, password),
        },
      });

      return await user.save();
    } catch (err) {
      if (err.message === MESSAGES.UNAUTHORIZED_EMAIL_IN_USE) {
        throw new ConflictException(MESSAGES.UNAUTHORIZED_EMAIL_IN_USE);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
