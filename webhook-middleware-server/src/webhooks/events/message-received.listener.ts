import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { DomainEventsService } from 'src/domain-events/domain-events.service';
import {
    DomainEvent,
    DomainEventDocument,
    DomainEventType,
} from 'src/domain-events/schemas/domain-event.schema';
import { SubscriberDocument } from 'src/subscribers/schemas/subscriber.schema';
import { SubscribersService } from 'src/subscribers/subscribers.service';

@Injectable()
export class MessageReceivedListener {
    constructor(
        private domainEventsService: DomainEventsService,
        private subscribersService: SubscribersService,
        private eventEmitter: EventEmitter2,
    ) {}
    @OnEvent(DomainEventType.Received)
    handleMessageReceivedEvent(event: DomainEvent): void {
        const startTime = new Date().getTime();
        event.payload = this.domainEventsService.normalizeWebhookPayload(
            event.payload,
        );
        this.domainEventsService
            .create(event)
            .then((newEvent: DomainEventDocument) => {
                this.subscribersService
                    .findAllByPublisherId(event.publisherId)
                    .then((subscribers: SubscriberDocument[]) => {
                        return this.subscribersService.notifySubscribers(
                            newEvent,
                            subscribers,
                        );
                    })
                    .then((events: DomainEvent[]) => {
                        events.map((event: DomainEvent) => {
                            event.executionTime =
                                new Date().getTime() - startTime;
                            this.eventEmitter.emit(DomainEventType.Sent, event);
                        });
                    });
            });
    }
}
