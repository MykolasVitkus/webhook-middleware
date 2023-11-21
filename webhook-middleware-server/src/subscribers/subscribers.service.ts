import {
    BadRequestException,
    forwardRef,
    Inject,
    Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EventEmitter2 } from 'eventemitter2';
import { Model } from 'mongoose';
import {
    DomainEvent,
    DomainEventDocument,
    DomainEventStatus,
    DomainEventType,
} from '../domain-events/schemas/domain-event.schema';
import { MappersService } from '../mappers/mappers.service';
import { SubscriberDto } from './dto/subscriber.dto';
import { Subscriber, SubscriberDocument } from './schemas/subscriber.schema';
import fetch from 'node-fetch';
import type { UpdateQuery } from 'mongoose';

@Injectable()
export class SubscribersService {
    constructor(
        @InjectModel(Subscriber.name)
        private subscriberModel: Model<SubscriberDocument>,
        @Inject(forwardRef(() => MappersService))
        private mappersService: MappersService,
        private eventEmitter: EventEmitter2,
    ) {}

    async create(subscriberDto: SubscriberDto): Promise<Subscriber> {
        const subscriber = new this.subscriberModel(subscriberDto);
        return subscriber.save();
    }

    async findAll(offset: string, limit: string): Promise<Subscriber[]> {
        return this.subscriberModel
            .find()
            .skip(parseInt(offset))
            .limit(parseInt(limit))
            .exec();
    }

    async getById(id: string): Promise<Subscriber> {
        const subscriber: Subscriber | null = await this.subscriberModel
            .findById(id)
            .exec();
        return subscriber;
    }

    async update(
        id: string,
        subscriberDto: SubscriberDto,
    ): Promise<Subscriber> {
        const query = subscriberDto as UpdateQuery<SubscriberDocument>;
        return await this.subscriberModel.findByIdAndUpdate(id, query, {
            useFindAndModify: true,
            new: true,
        });
    }

    async delete(id: string): Promise<void> {
        this.subscriberModel
            .findByIdAndRemove(id, {
                useFindAndModify: true,
            })
            .exec();
    }

    async count(): Promise<number> {
        return this.subscriberModel.countDocuments();
    }

    async findAllByPublisherId(id: string): Promise<SubscriberDocument[]> {
        return this.subscriberModel.find({ 'subscribedTo.publisherId': id });
    }

    async removeAllSubscriptionsWithMapper(mapperId: string): Promise<void> {
        const subscribers = await this.subscriberModel.find({
            'subscribedTo.mapperId': mapperId,
        });
        subscribers.forEach((subscriber: SubscriberDocument) => {
            subscriber.subscribedTo = subscriber.subscribedTo.filter(
                (subscriberPublisher) =>
                    subscriberPublisher.mapperId !== mapperId,
            );
            subscriber.save();
        });
    }

    async removeAllSubscriptionsWithPublisher(
        publisherId: string,
    ): Promise<void> {
        const subscribers = await this.subscriberModel.find({
            'subscribedTo.publisherId': publisherId,
        });
        subscribers.forEach((subscriber: SubscriberDocument) => {
            subscriber.subscribedTo = subscriber.subscribedTo.filter(
                (subscriberPublisher) =>
                    subscriberPublisher.publisherId !== publisherId,
            );
            subscriber.save();
        });
    }

    async sendWebhook(
        payload: unknown,
        subscriber: Subscriber,
    ): Promise<Response> {
        const data = JSON.stringify(payload);
        return fetch(subscriber.webhookUrl, {
            method: 'POST',
            body: data,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data || '', 'utf-8'),
            },
        });
    }

    async notifySubscriber(
        publishEvent: DomainEvent | DomainEventDocument,
        subscriber: SubscriberDocument | Subscriber,
    ): Promise<DomainEvent> {
        const mapperId = subscriber.subscribedTo.find(
            (subscribedTo) =>
                publishEvent.publisherId === subscribedTo.publisherId,
        ).mapperId;
        try {
            return this.mappersService
                .getById(mapperId)
                .then(async (mapper) => {
                    const newObject = this.mappersService.mapPayloadToFormat(
                        publishEvent.payload,
                        mapper.format,
                    );
                    return this.sendWebhook(newObject, subscriber).then(
                        async (response) => {
                            return new DomainEvent(
                                DomainEventType.Sent,
                                response.status < 300
                                    ? DomainEventStatus.Success
                                    : DomainEventStatus.Error,
                                newObject,
                                publishEvent.publisherId,
                                (<SubscriberDocument>subscriber)._id
                                    ? (<SubscriberDocument>subscriber)._id
                                    : subscriber.id,
                                {
                                    response: await response.text(),
                                    status: response.status,
                                },
                                {
                                    id: (<DomainEventDocument>publishEvent)._id,
                                    ...publishEvent,
                                },
                            );
                        },
                    );
                });
        } catch (exception) {
            this.eventEmitter.emit(
                DomainEventType.Sent,
                new DomainEvent(
                    DomainEventType.Sent,
                    DomainEventStatus.Error,
                    {},
                    publishEvent.publisherId,
                    (<SubscriberDocument>subscriber)._id
                        ? (<SubscriberDocument>subscriber)._id
                        : subscriber.id,
                    exception.response,
                ),
            );
            throw new BadRequestException(exception.response);
        }
    }

    async notifySubscribers(
        publishEvent: DomainEvent,
        subscribers: SubscriberDocument[],
    ): Promise<DomainEvent[]> {
        return Promise.all(
            subscribers.map((sub) => this.notifySubscriber(publishEvent, sub)),
        );
    }
}
