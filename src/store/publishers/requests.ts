import axios, { AxiosResponse } from 'axios';
import { Publisher, PublisherDTO } from './types';

interface GetPublishersResponse extends AxiosResponse {
    data: PublisherDTO[];
}

export const getPublishersQuery: () => Promise<Publisher[]> = () =>
    axios
    .get('/api/publishers')
    .then((res: GetPublishersResponse) => {
        return res.data.map((val: PublisherDTO) => {
            return {
                id: val._id,
                name: val.name,
                createdAt: new Date(val.createdAt)
            }
        })
    });