import { selector, selectorFamily } from 'recoil';
import { fromDictionary, toDictionary } from '../../utils/parsers';
import { Dictionary } from '../../utils/types';
import { mappers } from './atom';
import { getMapperByIdQuery, getMappersQuery } from './requests';
import { Mapper } from './types';

export const mappersSelector = selector<Mapper[]>({
    key: 'mappersSelector',
    get: ({ get }) => {
        const mappersList = get(mappers);
        return fromDictionary(mappersList);
    },
});

export const mappersQuerySelector = selector({
    key: 'mappersQuerySelector',
    get: async () => {
        return await getMappersQuery();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set:
        () =>
        ({ set }, newValue: Mapper[]) =>
            set(mappers, (prevState: Dictionary<Mapper>) => {
                return {
                    ...prevState,
                    ...toDictionary(newValue, 'id'),
                };
            }),
});

export const mappersByIdSelector = selectorFamily({
    key: 'mappersByIdSelector',
    get:
        (id: string) =>
        async ({ get }) => {
            const mapper = get(mappers)[id];
            if (mapper) {
                return mapper;
            }
            return await getMapperByIdQuery(id);
        },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set:
        (id: string) =>
        ({ set }, newValue: any) =>
            set(mappers, (prevState: Dictionary<Mapper>) => {
                return { ...prevState, [id]: newValue };
            }),
});
