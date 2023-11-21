import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscribersModule } from 'src/subscribers/subscribers.module';
import { DomainEventsController } from './domain-events.controller';
import { DomainEventsService } from './domain-events.service';
import { DomainEvent, DomainEventSchema } from './schemas/domain-event.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: DomainEvent.name, schema: DomainEventSchema },
        ]),
        SubscribersModule,
    ],
    controllers: [DomainEventsController],
    providers: [DomainEventsService],
    exports: [DomainEventsService],
})
export class DomainEventsModule {}
