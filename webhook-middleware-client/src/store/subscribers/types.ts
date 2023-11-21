import { Mapper } from '../mappers/types';
import { Publisher } from '../publishers/types';

export interface SubscriberForm {
    name: string;
    webhookUrl: string;
    subscribedTo: SubscribedPublisher[];
}

export interface SubscribedPublisher {
    publisherId: string;
    mapperId: string;
}

export type SubscribedPublisherType = {
    publisherId: string;
    mapperId: string;
};

export type ResolvedSubscribedPublisher = {
    publisher: Publisher;
    mapper: Mapper;
};

export type SubscriberType = {
    id: string;
    name: string;
    webhookUrl: string;
    subscribedTo: SubscribedPublisherType[];
    createdAt: Date;
};

export interface Subscriber {
    id: string;
    name: string;
    webhookUrl: string;
    subscribedTo: SubscribedPublisher[];
    createdAt: Date;
}

export interface SubscriberDTO {
    _id: string;
    name: string;
    webhookUrl: string;
    subscribedTo: SubscribedPublisher[];
    createdAt: Date;
}
