import axios, { AxiosResponse } from 'axios';
import { Mapper, MapperDTO, MapperForm } from './types';

interface GetMappersResponse extends AxiosResponse {
    data: MapperDTO[];
}

interface GetMapperResponse extends AxiosResponse {
    data: MapperDTO;
}

export const getMappersQuery: () => Promise<Mapper[]> = () =>
    axios.get('/api/mappers').then((res: GetMappersResponse) => {
        return res.data.map((val: MapperDTO) => {
            return {
                id: val._id,
                name: val.name,
                format: val.format,
                createdAt: new Date(val.createdAt),
            };
        });
    });

export const createMapperQuery: (body: MapperForm) => Promise<Mapper> = (
    body: MapperForm,
) =>
    axios.post('/api/mappers', body).then((val: GetMapperResponse) => {
        return {
            id: val.data._id,
            name: val.data.name,
            format: val.data.format,
            createdAt: new Date(val.data.createdAt),
        };
    });

export const deleteMapperQuery: (id: string) => void = (id: string) =>
    axios.delete('/api/mappers/' + id);
