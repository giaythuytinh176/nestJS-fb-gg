import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Post,
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
import { get, post, Response } from 'request';
import { IToken } from './interfaces/token.interface';

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

  async googleSignIn(code: string): Promise<any> {
    return new Promise((resolve: Function, reject: Function) => {
      post(
        {
          url: 'https://accounts.google.com/o/oauth2/token',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          form: {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_SECRET,
            redirect_uri: 'http://localhost:4200/recipes',
            grant_type: 'authorization_code',
          },
        },
        async (err: Error, res: Response, body: any) => {
          if (err) {
            return reject(err);
          }

          if (body.error) {
            return reject(body.error);
          }

          const { access_token } = JSON.parse(body);

          post(
            {
              url: `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${access_token}`,
            },
            // {
            //   url: `http://localhost:3000/auth/google/token`,
            //   headers: {
            //     'Content-Type': 'application/x-www-form-urlencoded',
            //   },
            //   form: {
            //     access_token,
            //   },
            // },
            async (err: Error, res: Response, body: any) => {
              // console.log('err', err);
              // console.log('res', res);
              // console.log('body', body);
              // console.log('token', access_token);

              if (err) {
                return reject(err);
              }

              if (body.error) {
                return reject(body.error);
              }

              const token = await this.createGoogle(body, access_token);
              // post(
              //   {
              //     url: `http://localhost:3000/auth/google/token`,
              //     headers: {
              //       'Content-Type': 'application/x-www-form-urlencoded',
              //     },
              //     form: {
              //       user: body,
              //     },
              //   },
              //   async (err: Error, res: Response, body: any) => {
              //     // console.log('err', err);
              //     // console.log('res', res);
              //     // console.log('body', body);

              //     if (err) {
              //       return reject(err);
              //     }

              //     if (body.error) {
              //       return reject(body.error);
              //     }

              //     resolve(body);
              //   },
              // );
              resolve({ body, token });
            },
          );
        },
      );
    });
  }

  async createGoogle(body: any, access_token: IToken): Promise<any> {
    const existingUser: IUser = await this.userModel.findOne({
      'google.id': body.sub,
    });

    if (existingUser) {
      return await this.createToken(existingUser);
      // return existingUser;
    }

    try {
      const user: IUser = new this.userModel({
        method: 'google',
        google: {
          id: body.sub,
          email: body.email ? body.email : undefined,
          displayName: body.displayName,
          token: access_token,
        },
      });

      await user.save();
      return await this.createToken(user);
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async createToken(user: IUser): Promise<IToken> {
    const expiresIn: string = '48h';
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

  async createToken1(user: IUser): Promise<tokenDTO> {
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
