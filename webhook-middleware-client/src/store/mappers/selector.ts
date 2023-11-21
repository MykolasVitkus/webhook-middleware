import { selector, selectorFamily } from 'recoil';
import { toDictionary } from '../../utils/parsers';
import { Dictionary, Pagination } from '../../utils/types';
import { mappers } from './atom';
import {
    getMapperByIdQuery,
    getMappersCountQuery,
    getMappersQuery,
} from './requests';
import { Mapper } from './types';

export const mappersSelector = selectorFamily<Mapper[], Pagination>({
    key: 'mappersSelector',
    get: (pagination: Pagination) => async () => {
        return await getMappersQuery(pagination);
    },
});

export const mappersQuerySelector = selector({
    key: 'mappersQuerySelector',
    get: async () => {
        return await getMappersQuery({ offset: 0, limit: 0, page: 1 });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set: () => ({ set }, newValue: Mapper[]) =>
        set(mappers, (prevState: Dictionary<Mapper>) => {
            return {
                ...prevState,
                ...toDictionary(newValue, 'id'),
            };
        }),
});

export const mappersCountSelector = selector({
    key: 'mappersCountQuerySelector',
    get: async () => {
        return await getMappersCountQuery();
    },
});

export const mappersByIdSelector = selectorFamily({
    key: 'mappersByIdSelector',
    get: (id: string) => async ({ get }) => {
        const mapper = get(mappers)[id];
        if (mapper) {
            return mapper;
        }
        return await getMapperByIdQuery(id);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set: (id: string) => ({ set }, newValue: any) =>
        set(mappers, (prevState: Dictionary<Mapper>) => {
            return { ...prevState, [id]: newValue };
        }),
});
