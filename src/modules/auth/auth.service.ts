import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  generateHashedPassword,
  generateSalt,
} from '../../utilities/encryption';
import { MESSAGES, USER_MODEL_TOKEN } from '../../server.constants';
import { CreateUserDTO } from '../user/dto/create-user.dto';
import { IUser } from '../user/interfaces/user.interface';
import { sign } from 'jsonwebtoken';
import { tokenDTO } from './dto/token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(USER_MODEL_TOKEN) private readonly userModel: Model<IUser>,
  ) {}

  async signUp(createUserDto: CreateUserDTO): Promise<tokenDTO> {
    const { email: email, password: password } = createUserDto;

    if (await this.userModel.findOne({ 'local.email': email.toLowerCase() })) {
      throw new UnauthorizedException(MESSAGES.UNAUTHORIZED_EMAIL_IN_USE);
    }

    try {
      const salt: string = generateSalt();
      const user: IUser = new this.userModel({
        method: 'local',
        local: {
          email,
          salt,
          hashedPassword: generateHashedPassword(salt, password),
        },
      });

      await user.save();

      return this.createToken(user);
    } catch (error) {
      if (
        error.code === '23505' ||
        error.message === MESSAGES.UNAUTHORIZED_EMAIL_IN_USE
      ) {
        // 23505 duplicate username
        throw new ConflictException(MESSAGES.UNAUTHORIZED_EMAIL_IN_USE);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findUserById(id: string): Promise<IUser> {
    return await this.userModel.findById(id);
  }

  async googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }

    return {
      message: 'User information from google',
      user: req.user,
    };
  }

  async createToken(user: IUser): Promise<tokenDTO> {
    const expiresIn = '48h';
    const token: string = sign(
      {
        sub: user.id,
      },
      process.env.jwtSecret,
      { expiresIn },
    );

    return {
      token,
    };
  }
}
