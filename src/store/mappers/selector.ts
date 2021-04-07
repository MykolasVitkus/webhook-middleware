import { selector } from 'recoil';
import { fromDictionary } from '../../utils/parsers';
import { mappers } from './atom';
import { Mapper } from './types';

export const mappersSelector = selector<Mapper[]>({
    key: 'mappersSelector',
    get: ({ get }) => {
        const mappersList = get(mappers);
        return fromDictionary(mappersList);
    },
});
