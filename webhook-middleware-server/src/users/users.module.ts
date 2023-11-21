import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ConsoleModule } from 'nestjs-console';
import { User, UserSchema } from './schemas/user.schema';
import { UsersService } from './users.service';

@Module({
    providers: [UsersService],
    exports: [UsersService],
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigService) => {
                return {
                    uri: config.get('DATABASE_URL'),
                };
            },
            inject: [ConfigService],
        }),
        ConsoleModule,
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
})
export class UsersModule {}
