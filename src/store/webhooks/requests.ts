import axios, { AxiosResponse } from 'axios';
import { Webhook, WebhookDTO } from './types';

interface GetWebhooksResponse extends AxiosResponse {
    data: WebhookDTO[];
}

interface GetWebhookResponse extends AxiosResponse {
    data: WebhookDTO;
}

export const getPublishedWebhooksByPublisherIdQuery: (
    id: string,
) => Promise<Webhook[]> = (id: string) =>
    axios
        .get('/api/domain-events/publisher/' + id + '/published-webhooks/')
        .then((res: GetWebhooksResponse) => {
            return res.data.map((val: WebhookDTO) => {
                return {
                    id: val._id,
                    type: val.type,
                    status: val.status,
                    payload: val.payload,
                    publisherId: val.publisherId,
                    subscriberId: val.subscriberId,
                    metadata: val.metadata,
                    prevEvent: val.prevEvent,
                    createdAt: new Date(val.createdAt),
                };
            });
        });

export const getReceivedWebhooksBySubscriberIdQuery: (
    id: string,
) => Promise<Webhook[]> = (id: string) =>
    axios
        .get('/api/domain-events/subscriber/' + id + '/received-webhooks/')
        .then((res: GetWebhooksResponse) => {
            return res.data.map((val: WebhookDTO) => {
                return {
                    id: val._id,
                    type: val.type,
                    status: val.status,
                    payload: val.payload,
                    publisherId: val.publisherId,
                    subscriberId: val.subscriberId,
                    metadata: val.metadata,
                    prevEvent: val.prevEvent,
                    createdAt: new Date(val.createdAt),
                };
            });
        });

export const resendWebhookQuery: (id: string) => Promise<Webhook> = (
    id: string,
) =>
    axios
        .post('/api/domain-events/retry/' + id)
        .then((res: GetWebhookResponse) => {
            return {
                id: res.data._id,
                type: res.data.type,
                status: res.data.status,
                payload: res.data.payload,
                publisherId: res.data.publisherId,
                subscriberId: res.data.subscriberId,
                metadata: res.data.metadata,
                prevEvent: res.data.prevEvent,
                createdAt: new Date(res.data.createdAt),
            };
        });
