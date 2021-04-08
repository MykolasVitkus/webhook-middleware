import { selectorFamily } from 'recoil';
import { Dictionary } from '../../utils/types';
import { webhooks } from './atom';
import { getPublishedWebhooksByPublisherIdQuery } from './requests';
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
