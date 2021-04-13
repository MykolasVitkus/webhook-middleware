import { selectorFamily } from 'recoil';
import { fromDictionary } from '../../utils/parsers';
import { Dictionary } from '../../utils/types';
import { webhooks } from './atom';
import {
    getPublishedWebhooksByPublisherIdQuery,
    getReceivedWebhooksBySubscriberIdQuery,
} from './requests';
import { Webhook } from './types';

export const publishedWebhooksSelector = selectorFamily({
    key: 'publishedWebhooksByPublisherIdSelector',
    get: (id: string) => async () => {
        return await getPublishedWebhooksByPublisherIdQuery(id);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set: (id: string) => ({ set }, newValue: any) =>
        set(webhooks, (prevState: Dictionary<Webhook>) => {
            return { ...prevState, [id]: newValue };
        }),
});

export const receivedWebhooksSelector = selectorFamily({
    key: 'receivedWebhooksBySubscriberIdSelector',
    get: (id: string) => async ({ get }) => {
        const subscriberWebhooks = fromDictionary(get(webhooks)).filter(
            (webhook: Webhook) => {
                return webhook.subscriberId === id;
            },
        );
        return subscriberWebhooks.length > 0
            ? subscriberWebhooks
            : await getReceivedWebhooksBySubscriberIdQuery(id);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set: (id: string) => ({ set }, newValue: any) =>
        set(webhooks, (prevState: Dictionary<Webhook>) => {
            return { ...prevState, [id]: newValue };
        }),
});

// export const receivedLoadedWebhooksSelector = selectorFamily<any, string>({
//     key: 'receivedLoadedWebhooksBySubscriberIdSelector',
//     get: (id: string) => async () => {
//         return await getReceivedWebhooksBySubscriberIdQuery(id).then(
//             (webhooks: Webhook[]) => {
//                 return webhooks.map((webhook: Webhook) => {
//                     const publisher = useRecoilValue(
//                         publishersByIdSelector(webhook.publisherId as string),
//                     );
//                     const subscriber = useRecoilValue(
//                         subscribersByIdSelector(webhook.subscriberId as string),
//                     );
//                     return {
//                         id: webhook.id,
//                         type: webhook.type,
//                         status: webhook.status,
//                         payload: webhook.payload,
//                         publisher: publisher,
//                         subscriberId: subscriber,
//                         createdAt: webhook.createdAt,
//                         metadata: webhook.metadata,
//                         prevEvent: webhook.prevEvent,
//                     };
//                 });
//             },
//         );
//     },
// });
