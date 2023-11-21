import { atom } from 'recoil';
import { Dictionary } from '../../utils/types';
import { Subscriber, SubscriberForm } from './types';

export const subscribers = atom<Dictionary<Subscriber>>({
    key: 'subscribers',
    default: {},
});

export const deleteSubscriberModal = atom({
    key: 'deleteSubscriber',
    default: {
        subscriberId: '',
        open: false,
    },
});

export const loadedSubscribersList = atom({
    key: 'loadedSubscribersList',
    default: false,
});

export const createSubscriberForm = atom<SubscriberForm>({
    key: 'subscriberForm',
    default: {
        name: '',
        webhookUrl: '',
        subscribedTo: [],
    },
});
