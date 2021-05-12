import { Publisher } from '../publishers/types';
import { Subscriber } from '../subscribers/types';

export interface Webhook {
    id: string;
    type: string;
    status: string;
    payload: unknown;
    publisherId: string | null;
    subscriberId: string | null;
    createdAt: Date;
    metadata: ResponseType | null;
    prevEvent: Webhook | null;
}

export interface WebhookLoaded {
    id: string;
    type: string;
    status: string;
    payload: unknown;
    publisher: Publisher | null;
    subscriber: Subscriber | null;
    createdAt: Date;
    metadata: ResponseType | null;
    prevEvent: Webhook | null;
}

export type Filters = {
    offset: string | null;
    limit: string | null;
    type: string | null;
    searchQuery: string | null;
    searchProperty: string | null;
    status: WebhookStatus | null;
    orderField: string | null;
    orderDirection: string | null;
};

export interface WebhookDTO {
    _id: string;
    type: string;
    status: string;
    payload: unknown;
    publisherId: string | null;
    subscriberId: string | null;
    createdAt: Date;
    metadata: ResponseType | null;
    prevEvent: Webhook | null;
}

export enum WebhookStatus {
    Error = 'error',
    Success = 'success',
}

export interface ResponseType {
    response: string | null;
    status: number;
}
