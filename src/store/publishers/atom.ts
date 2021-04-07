import { atom } from 'recoil';
import { Dictionary } from '../../utils/types';
import { Publisher } from './types';

export const publishers = atom<Dictionary<Publisher>>({
    key: 'publishers',
    default: {},
});

export const publisherForm = atom<Publisher>({
    key: 'publisherForm',
    default: {
        id: '',
        name: '',
        createdAt: new Date(),
    },
});

export const deletePublisherModal = atom({
    key: 'deletePublisherModal',
    default: {
        publisherId: '',
        open: false,
    },
});

export const loadedPublishersList = atom({
    key: 'loadedPublishersList',
    default: false,
});

export const loadedPublisher = atom({
    key: 'loadedPublisher',
    default: false,
});
