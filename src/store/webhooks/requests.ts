/* eslint-disable no-prototype-builtins */
import axios, { AxiosResponse } from 'axios';
import { setupInterceptorsTo } from '../../interceptors';
import { getToken } from '../auth/service';
import { Filters, Webhook, WebhookDTO } from './types';
import { pickBy } from 'lodash';

const axiosInstance = setupInterceptorsTo(axios.create());

interface GetWebhooksResponse extends AxiosResponse {
    data: WebhookDTO[];
}

interface GetWebhookResponse extends AxiosResponse {
    data: WebhookDTO;
}

interface getNumberResponse extends AxiosResponse {
    data: number;
}

export const getPublishedWebhooksByPublisherIdQuery: (
    id: string,
) => Promise<Webhook[]> = (id: string) =>
    axiosInstance
        .get('/api/domain-events/publisher/' + id + '/published-webhooks/', {
            headers: {
                Authorization: 'Bearer '.concat(getToken() as string),
            },
        })
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
    axiosInstance
        .get('/api/domain-events/subscriber/' + id + '/received-webhooks/', {
            headers: {
                Authorization: 'Bearer '.concat(getToken() as string),
            },
        })
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
    axiosInstance
        .post(
            `/api/domain-events/retry/${id}`,
            {},
            {
                headers: {
                    Authorization: 'Bearer '.concat(getToken() as string),
                },
            },
        )
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

export const getFilteredWebhooks: (filters: Filters) => Promise<Webhook[]> = (
    filters: Filters,
) =>
    axiosInstance
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .get(
            '/api/domain-events?' +
                new URLSearchParams(
                    pickBy(filters, (v) => v !== undefined) as any,
                ).toString(),
            {
                headers: {
                    Authorization: 'Bearer '.concat(getToken() as string),
                },
            },
        )
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

export const getFilteredWebhooksCount: (filters: Filters) => Promise<number> = (
    filters: Filters,
) =>
    axiosInstance
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .get(
            '/api/domain-events/count?' +
                new URLSearchParams(
                    pickBy(filters, (v) => v !== undefined) as any,
                ).toString(),
            {
                headers: {
                    Authorization: 'Bearer '.concat(getToken() as string),
                },
            },
        )
        .then((res: getNumberResponse) => {
            return res.data;
        });
