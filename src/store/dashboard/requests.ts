import axios, { AxiosResponse } from 'axios';
import { setupInterceptorsTo } from '../../interceptors';
import { getToken } from '../auth/service';
import { StatisticsDay } from './types';

const axiosInstance = setupInterceptorsTo(axios.create());

interface GetNumberResponse extends AxiosResponse {
    data: number;
}

interface GetNumbersResponse extends AxiosResponse {
    data: number[];
}

interface getDaysResponse extends AxiosResponse {
    data: StatisticsDay[];
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

export const getExecutionTimes: () => Promise<number[]> = () => {
    const today = new Date();
    return axiosInstance
        .get(
            `/api/domain-events/times?from=${new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() - 7,
            ).toString()}&to=${today.toString()}`,
            {
                headers: {
                    Authorization: 'Bearer '.concat(getToken() as string),
                },
            },
        )
        .then((res: GetNumbersResponse) => {
            return res.data;
        });
};

export const getDaysCounts: (type: string) => Promise<StatisticsDay[]> = (
    type,
) => {
    const today = new Date();
    return axiosInstance
        .get(
            `/api/domain-events/counts?from=${new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() - 7,
            ).toString()}&to=${today.toString()}&type=${type}`,
            {
                headers: {
                    Authorization: 'Bearer '.concat(getToken() as string),
                },
            },
        )
        .then((res: getDaysResponse) => {
            return res.data;
        });
};
