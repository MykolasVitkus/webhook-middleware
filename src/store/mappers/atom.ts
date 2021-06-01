import { atom } from 'recoil';
import { Dictionary } from '../../utils/types';
import { Mapper, MapperForm } from './types';

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

export const createMapperForm = atom<MapperForm>({
    key: 'mapperForm',
    default: {
        name: '',
        format: {},
        sample: {
            name: 'test webhook',
            type: 1,
            chansnel_id: '199737254929760256',
            token: '3d89bb7572e0fb30d8128367b3b1b44fecd1726de135cbe28a41f8b2f777c372ba2939e72279b94526ff5d1bd4358d65cf11',
            message: 'Hello Guys',
        },
    },
});
