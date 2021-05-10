import axios, { AxiosResponse } from 'axios';
import { setupInterceptorsTo } from '../../interceptors';
import { getToken } from '../auth/service';

const axiosInstance = setupInterceptorsTo(axios.create());

interface GetNumberResponse extends AxiosResponse {
    data: number;
}

export const getTotalSent: () => Promise<number> = () => {
    const today = new Date();
    return axiosInstance
        .get(
            `/api/domain-events/count?from=${new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() - 7,
            ).toString()}&to=${today.toString()}&type=sent_message`,
            {
                headers: {
                    Authorization: 'Bearer '.concat(getToken() as string),
                },
            },
        )
        .then((res: GetNumberResponse) => {
            return res.data;
        });
};

export const getTotalReceived: () => Promise<number> = () => {
    const today = new Date();
    return axiosInstance
        .get(
            `/api/domain-events/count?from=${new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() - 7,
            ).toString()}&to=${today.toString()}&type=received_message`,
            {
                headers: {
                    Authorization: 'Bearer '.concat(getToken() as string),
                },
            },
        )
        .then((res: GetNumberResponse) => {
            return res.data;
        });
};

export const getAverageTime: () => Promise<number> = () =>
    axiosInstance
        .get('/api/domain-events/average-time', {
            headers: {
                Authorization: 'Bearer '.concat(getToken() as string),
            },
        })
        .then((res: GetNumberResponse) => {
            return res.data;
        });
