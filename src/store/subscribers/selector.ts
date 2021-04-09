import { selector, selectorFamily } from 'recoil';
import { fromDictionary } from '../../utils/parsers';
import { Dictionary } from '../../utils/types';
import { subscribers } from './atom';
import { getSubscriberByIdQuery } from './requests';
import { Subscriber } from './types';

export const subscribersSelector = selector<Subscriber[]>({
    key: 'subscribersSelector',
    get: ({ get }) => {
        const subscribersList = get(subscribers);
        return fromDictionary(subscribersList);
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
