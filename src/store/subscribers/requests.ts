import axios, { AxiosResponse } from 'axios';
import { setupInterceptorsTo } from '../../interceptors';
import { getToken } from '../auth/service';
import { Subscriber, SubscriberDTO, SubscriberForm } from './types';

const axiosInstance = setupInterceptorsTo(axios.create());

interface GetSubscribersResponse extends AxiosResponse {
    data: SubscriberDTO[];
}

interface GetSubscriberResponse extends AxiosResponse {
    data: SubscriberDTO;
}

export const getSubscribersQuery: () => Promise<Subscriber[]> = () =>
    axiosInstance
        .get('/api/subscribers', {
            headers: {
                Authorization: 'Bearer '.concat(getToken() as string),
            },
        })
        .then((res: GetSubscribersResponse) => {
            return res.data.map((val: SubscriberDTO) => {
                return {
                    id: val._id,
                    name: val.name,
                    subscribedTo: val.subscribedTo,
                    webhookUrl: val.webhookUrl,
                    createdAt: new Date(val.createdAt),
                };
            });
        });

export const getSubscriberByIdQuery: (id: string) => Promise<Subscriber> = (
    id: string,
) =>
    axiosInstance
        .get('/api/subscribers/' + id, {
            headers: {
                Authorization: 'Bearer '.concat(getToken() as string),
            },
        })
        .then((val: GetSubscriberResponse) => {
            return {
                id: val.data._id,
                name: val.data.name,
                subscribedTo: val.data.subscribedTo,
                webhookUrl: val.data.webhookUrl,
                createdAt: new Date(val.data.createdAt),
            };
        });

export const createSubscriberQuery: (
    body: SubscriberForm,
) => Promise<Subscriber> = (body: SubscriberForm) =>
    axiosInstance
        .post('/api/subscribers', body, {
            headers: {
                Authorization: 'Bearer '.concat(getToken() as string),
            },
        })
        .then((val: GetSubscriberResponse) => {
            return {
                id: val.data._id,
                name: val.data.name,
                subscribedTo: val.data.subscribedTo,
                webhookUrl: val.data.webhookUrl,
                createdAt: new Date(val.data.createdAt),
            };
        });

export const editSubscriberQuery: (
    body: SubscriberForm,
    id: string,
) => Promise<Subscriber> = (body: SubscriberForm, id: string) =>
    axiosInstance
        .put('/api/subscribers/' + id, body, {
            headers: {
                Authorization: 'Bearer '.concat(getToken() as string),
            },
        })
        .then((val: GetSubscriberResponse) => {
            return {
                id: val.data._id,
                name: val.data.name,
                subscribedTo: val.data.subscribedTo,
                webhookUrl: val.data.webhookUrl,
                createdAt: new Date(val.data.createdAt),
            };
        });

export const deleteSubscriberQuery: (id: string) => void = (id: string) =>
    axiosInstance.delete('/api/subscribers/' + id, {
        headers: {
            Authorization: 'Bearer '.concat(getToken() as string),
        },
    });
