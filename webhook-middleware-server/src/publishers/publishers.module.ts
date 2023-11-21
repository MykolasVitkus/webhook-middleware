import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscribersModule } from '../subscribers/subscribers.module';
import { PublishersController } from './publishers.controller';
import { PublishersService } from './publishers.service';
import { Publisher, PublisherSchema } from './schemas/publisher.schema';

export const DEFAULT_OFFSET = '0';
export const DEFAULT_LIMIT = '10';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Publisher.name, schema: PublisherSchema },
        ]),
        SubscribersModule,
    ],
    controllers: [PublishersController],
    providers: [PublishersService],
    exports: [PublishersService],
})
export class PublishersModule {}
