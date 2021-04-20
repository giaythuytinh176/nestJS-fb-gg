import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Command, ConsoleService } from 'nestjs-console';
import {
  generateHashedPassword,
  generateSalt,
} from '../../utilities/encryption';
import { MESSAGES, USER_MODEL_TOKEN } from '../../server.constants';
import { CreateUserDTO } from './dto/create-user.dto';
import { IUser } from './interfaces/user.interface';
import commander from 'commander';
import { authUserSchema } from './joi/auth-user.joi';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(USER_MODEL_TOKEN) private readonly userModel: Model<IUser>,
    private readonly consoleService: ConsoleService,
  ) {
    // get the root cli
    const cli = this.consoleService.getCli();

    // create a single command (See [npm commander arguments/options for more details])
    this.consoleService.createCommand(
      {
        command: 'create-user <email> <password>',
        description: 'To create user using console-nestJS',
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
      console.log(new BadRequestException(`Validation failed: ${message}`));
      return;
    }
    return await this.signUp(createUserDto);
  };

  @Command({
    description: 'A complete command handler',
    command: 'myCommandWithArgumentsAndOptions <arg1> <arg2>',

    options: [
      {
        flags: '-o1, --option1 <o1Value>',
        required: false,
      },
      {
        flags: '-o2, --option2 <o1Value>',
        required: true,
      },
    ],
  })
  completeCommandHandler(
    arg1: string,
    arg2: string,
    command: commander.Command,
  ): void {
    // read command arguments
    console.log(arg1, arg2);

    // read command options
    const options = command.opts();
    console.log(options.option1, options.option2);
  }

  async signUp(createUserDto: CreateUserDTO): Promise<void> {
    const email = createUserDto.email.toLowerCase();

    try {
      if (await this.userModel.findOne({ 'local.email': email })) {
        console.log(new UnauthorizedException(MESSAGES.UNAUTHORIZED_EMAIL_IN_USE));
        return;
      }

      const salt: string = generateSalt();
      const user: IUser = new this.userModel({
        method: 'local',
        local: {
          email,
          salt,
          hashedPassword: generateHashedPassword(salt, createUserDto.password),
        },
      });
      console.log('user', user);

      await user.save();
    } catch (e) {
      console.log(new InternalServerErrorException());
    }
  }

  async getUsers(): Promise<IUser[]> {
    return this.userModel.find(
      {},
      { method: 1, email: 1, 'local.email': 1, 'facebook.email': 1, 'google.email': 1 },
    );
  }
}
