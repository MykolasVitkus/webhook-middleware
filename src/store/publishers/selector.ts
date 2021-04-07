import { selector, selectorFamily } from 'recoil';
import { fromDictionary } from '../../utils/parsers';
import { Dictionary } from '../../utils/types';
import { publishers } from './atom';
import { getPublisherByIdQuery } from './requests';
import { Publisher } from './types';

export const publishersSelector = selector<Publisher[]>({
    key: 'publishersSelector',
    get: ({ get }) => {
        const publishersList = get(publishers);
        return fromDictionary(publishersList);
    },
});

export const publishersByIdSelector = selectorFamily({
    key: 'publishersByIdSelector',
    get: (id: string) => async ({ get }) => {
        const publisher = get(publishers)[id];
        if (publisher) {
            return publisher;
        }
        return await getPublisherByIdQuery(id);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set: (id: string) => ({ set }, newValue: any) =>
        set(publishers, (prevState: Dictionary<Publisher>) => {
            return { ...prevState, [id]: newValue };
        }),
});
