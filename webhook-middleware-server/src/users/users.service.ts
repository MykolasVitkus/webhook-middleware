import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Command, Console, createSpinner } from 'nestjs-console';
import { User, UserDocument } from './schemas/user.schema';

@Console()
@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
    ) {}

    async findOne(_username: string): Promise<User | undefined> {
        return this.userModel.findOne({ username: _username });
    }

    async create(_username: string, _password: string): Promise<User> {
        const user = new this.userModel({
            username: _username,
            password: _password,
        });
        return user.save();
    }

    @Command({
        command: 'create-user <username> <password>',
        description: 'Creates a user and saves it in the database',
    })
    async createUser(username: string, password: string): Promise<void> {
        const spin = createSpinner();
        spin.start(`Creating a user`);

        await this.create(username, password);

        spin.succeed(`User with username ${username} successfully created`);
    }
}
