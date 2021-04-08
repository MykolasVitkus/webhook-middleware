import axios, { AxiosResponse } from 'axios';
import { Webhook, WebhookDTO } from './types';

interface GetWebhooksResponse extends AxiosResponse {
    data: WebhookDTO[];
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
