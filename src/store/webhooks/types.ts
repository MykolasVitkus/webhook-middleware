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
    offset: string;
    limit: string;
    type: string | undefined;
    searchQuery: string | undefined;
    searchProperty: string | undefined;
    status: WebhookStatus | undefined;
    orderField: string | undefined;
    orderDirection: string | undefined;
    dateFrom: Date | undefined;
    dateTo: Date | undefined;
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
