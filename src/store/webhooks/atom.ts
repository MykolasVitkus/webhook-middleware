import { atom } from 'recoil';
import { Dictionary } from '../../utils/types';
import { Webhook } from './types';

export const webhooks = atom<Dictionary<Webhook>>({
    key: 'webhooks',
    default: {},
});
