import { atom } from 'recoil';
import { Dictionary } from '../../utils/types';
import { Mapper } from './types';

export const mappers = atom<Dictionary<Mapper>>({
    key: 'mappers',
    default: {},
});

export const deleteMapperModal = atom({
    key: 'deleteMapperModal',
    default: {
        mapperId: '',
        open: false,
    },
});

export const loadedMappersList = atom({
    key: 'loadedMappersList',
    default: false,
});
