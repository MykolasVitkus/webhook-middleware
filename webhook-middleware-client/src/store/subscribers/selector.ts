import { selector, selectorFamily } from 'recoil';
import { Dictionary, Pagination } from '../../utils/types';
import { getMapperByIdQuery } from '../mappers/requests';
import { getPublisherByIdQuery } from '../publishers/requests';
import { subscribers } from './atom';
import {
    getSubscriberByIdQuery,
    getSubscribersCountQuery,
    getSubscribersQuery,
} from './requests';
import {
    SubscriberType,
    ResolvedSubscribedPublisher,
    SubscribedPublisher,
    Subscriber,
} from './types';

export const subscribersSelector = selectorFamily<Subscriber[], Pagination>({
    key: 'subscribersSelector',
    get: (pagination: Pagination) => async () => {
        return getSubscribersQuery(pagination);
    },
});

export const subscribersCountSelector = selector({
    key: 'subscribersCountQuerySelector',
    get: async () => {
        return await getSubscribersCountQuery();
    },
});

export const subscribersByIdSelector = selectorFamily({
    key: 'subscribersByIdSelector',
    get: (id: string) => async ({ get }) => {
        const subscriber = get(subscribers)[id];
        if (subscriber) {
            return subscriber;
        }
        return await getSubscriberByIdQuery(id);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set: (id: string) => ({ set }, newValue: any) =>
        set(subscribers, (prevState: Dictionary<Subscriber>) => {
            return { ...prevState, [id]: newValue };
        }),
});

export const subscriptionsBySubscriberSelector = selectorFamily<
    ResolvedSubscribedPublisher[],
    SubscriberType
>({
    key: 'subscriptionsBySubscriberSelector',
    get: (subscriber: SubscriberType) => async () => {
        const subscriptions = subscriber.subscribedTo;
        return Promise.all(
            subscriptions.map(async (subscription: SubscribedPublisher) => {
                return {
                    publisher: await getPublisherByIdQuery(
                        subscription.publisherId,
                    ),
                    mapper: await getMapperByIdQuery(subscription.mapperId),
                } as ResolvedSubscribedPublisher;
            }),
        );
    },
});
