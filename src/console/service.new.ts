import { Command, Console } from 'nestjs-console';

// service.new.ts - a nestjs provider using console decorators (sub commands)
@Console({
  name: 'new',
  description: 'A command to create an item',
})
export class MyNewService {
  @Command({
    command: 'file <name>',
    description: 'Create a file',
  })
  async createFile(name: string): Promise<void> {
    console.log(`Creating a file named ${name}`);
    // your code...
  }

  @Command({
    command: 'directory <name>',
    description: 'Create a directory',
  })
  async createDirectory(name: string): Promise<void> {
    console.log(`Creating a directory named ${name}`);
    // your code...
  }
}
