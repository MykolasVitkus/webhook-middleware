import { Module } from '@nestjs/common';
import { DomainEventsModule } from '..//domain-events/domain-events.module';
import { PublishersModule } from '../publishers/publishers.module';
import { SubscribersModule } from '../subscribers/subscribers.module';
import { MessageReceivedListener } from './events/message-received.listener';
import { MessageSentListener } from './events/message-sent.listener';
import { WebhooksController } from './webhooks.controller';

export const DEFAULT_OFFSET = '0';
export const DEFAULT_LIMIT = '10';

@Module({
    imports: [DomainEventsModule, PublishersModule, SubscribersModule],
    controllers: [WebhooksController],
    providers: [MessageReceivedListener, MessageSentListener],
})
export class WebhooksModule {}
