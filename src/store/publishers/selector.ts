import { selector, selectorFamily } from 'recoil';
import { fromDictionary, toDictionary } from '../../utils/parsers';
import { Dictionary } from '../../utils/types';
import { publishers } from './atom';
import { getPublisherByIdQuery, getPublishersQuery } from './requests';
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
    get:
        (id: string | null) =>
        async ({ get }) => {
            if (!id) {
                return null;
            }
            const publisher = get(publishers)[id];
            if (publisher) {
                return publisher;
            }
            return await getPublisherByIdQuery(id);
        },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set:
        (id: string) =>
        ({ set }, newValue: any) =>
            set(publishers, (prevState: Dictionary<Publisher>) => {
                return { ...prevState, [id]: newValue };
            }),
});

export const publishersQuerySelector = selector({
    key: 'publishersQuerySelector',
    get: async () => {
        return await getPublishersQuery();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set:
        () =>
        ({ set }, newValue: Publisher[]) =>
            set(publishers, (prevState: Dictionary<Publisher>) => {
                return {
                    ...prevState,
                    ...toDictionary(newValue, 'id'),
                };
            }),
});
