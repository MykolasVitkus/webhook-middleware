import { atom } from 'recoil';
import { Statistics } from './types';

export const statistics = atom<Statistics>({
    key: 'statistics',
    default: {
        received: 0,
        sent: 0,
        averageTime: 0,
        executionTimes: [],
        sentDays: [],
        receivedDays: [],
    },
});
