import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConsoleService } from 'nestjs-console';
import { generateHashedPassword, generateSalt } from '../utilities/encryption';
import { MESSAGES, USER_MODEL_TOKEN } from '../server.constants';
import { authUserSchema } from '../modules/user/joi/auth-user.joi';
import { IUser } from '../modules/user/interfaces/user.interface';
import { CreateUserDTO } from '../modules/user/dto/create-user.dto';

@Injectable()
export class UserConsole {
  constructor(
    @InjectModel(USER_MODEL_TOKEN) private readonly userModel: Model<IUser>,
    private readonly consoleService: ConsoleService,
  ) {
    // get the root cli
    const cli = this.consoleService.getCli();

    // create a single command (See [npm commander arguments/options for more details])

    this.consoleService.createCommand(
      {
        command: 'createUser <email> <password>',
        description: 'To create user using console-nestJS',
        options: [
          {
            flags: '--email, -e <o1Value>',
            required: true,
          },
          {
            flags: '--password, -p <o1Value>',
            required: true,
          },
        ],
      },
      this.createUser,
      cli, // attach the command to the cli
    );
  }

  createUser = async (email: string, password: string): Promise<any> => {
    const createUserDto: CreateUserDTO = { email, password };

    const schema = authUserSchema;
    const result = schema.validate(createUserDto);
    if (result.error) {
      const errorMessage = result.error.details.shift().message;
      const message: string = errorMessage.replace(/["]/g, '');
      console.log(`Validation failed: ${message}`);
      return;
    }

    return await this.signUp(createUserDto);
  };

  async signUp(createUserDto: CreateUserDTO): Promise<void> {
    const email = createUserDto.email.toLowerCase();

    if (await this.userModel.findOne({ 'local.email': email })) {
      console.log(MESSAGES.UNAUTHORIZED_EMAIL_IN_USE);
      return;
    }

    try {
      const salt: string = generateSalt();
      const user: IUser = new this.userModel({
        method: 'local',
        local: {
          email,
          salt,
          hashedPassword: generateHashedPassword(salt, createUserDto.password),
        },
      });
      await user.save();
      console.log('User created successfully', user.local.email);
    } catch (e) {
      console.log(new InternalServerErrorException());
    }
  }
}
