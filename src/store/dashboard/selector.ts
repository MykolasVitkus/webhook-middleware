import { selector } from 'recoil';
import { statistics } from './atom';
import { getAverageTime, getTotalReceived, getTotalSent } from './requests';
import { Statistics } from './types';

export const statisticsSelector = selector({
    key: 'statisticsSelector',
    get: async () => {
        return {
            received: await getTotalReceived(),
            sent: await getTotalSent(),
            averageTime: await getAverageTime(),
        };
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set: () => ({ set }, newValue: Statistics) =>
        set(statistics, (prevState: Statistics) => {
            return newValue;
        }),
});
