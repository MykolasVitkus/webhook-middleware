import axios, { AxiosResponse } from 'axios';
import { getToken } from '../auth/service';
import { Mapper, MapperDTO, MapperForm } from './types';

interface GetMappersResponse extends AxiosResponse {
    data: MapperDTO[];
}

interface GetMapperResponse extends AxiosResponse {
    data: MapperDTO;
}

export const getMappersQuery: () => Promise<Mapper[]> = () =>
    axios
        .get('/api/mappers', {
            headers: {
                Authorization: 'Bearer '.concat(getToken() as string),
            },
        })
        .then((res: GetMappersResponse) => {
            return res.data.map((val: MapperDTO) => {
                return {
                    id: val._id,
                    name: val.name,
                    format: val.format,
                    sample: val.sample,
                    createdAt: new Date(val.createdAt),
                };
            });
        });

export const getMapperByIdQuery: (id: string) => Promise<Mapper> = (
    id: string,
) =>
    axios
        .get('/api/mappers/' + id, {
            headers: {
                Authorization: 'Bearer '.concat(getToken() as string),
            },
        })
        .then((val: GetMapperResponse) => {
            return {
                id: val.data._id,
                name: val.data.name,
                format: val.data.format,
                sample: val.data.sample,
                createdAt: new Date(val.data.createdAt),
            };
        });

export const createMapperQuery: (body: MapperForm) => Promise<Mapper> = (
    body: MapperForm,
) =>
    axios
        .post('/api/mappers', body, {
            headers: {
                Authorization: 'Bearer '.concat(getToken() as string),
            },
        })
        .then((val: GetMapperResponse) => {
            return {
                id: val.data._id,
                name: val.data.name,
                format: val.data.format,
                sample: val.data.sample,
                createdAt: new Date(val.data.createdAt),
            };
        });

export const editMapperQuery: (
    body: MapperForm,
    id: string,
) => Promise<Mapper> = (body: MapperForm, id: string) =>
    axios
        .put('/api/mappers/' + id, body, {
            headers: {
                Authorization: 'Bearer '.concat(getToken() as string),
            },
        })
        .then((val: GetMapperResponse) => {
            return {
                id: val.data._id,
                name: val.data.name,
                format: val.data.format,
                sample: val.data.sample,
                createdAt: new Date(val.data.createdAt),
            };
        });

export const deleteMapperQuery: (id: string) => void = (id: string) =>
    axios.delete('/api/mappers/' + id, {
        headers: {
            Authorization: 'Bearer '.concat(getToken() as string),
        },
    });
