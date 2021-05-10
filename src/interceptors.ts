import {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
} from 'axios';
import Routes from './utils/routes';
import { unsetToken } from '../src/store/auth/service';

const onRequest = (config: AxiosRequestConfig): AxiosRequestConfig => {
    return config;
};

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
    return response;
};

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
    if (
        (error.response as AxiosResponse).status === 401 &&
        window.location.pathname !== Routes.Login
    ) {
        unsetToken();
        window.location.href = Routes.Login;
    }
    return Promise.reject(error);
};

export function setupInterceptorsTo(
    axiosInstance: AxiosInstance,
): AxiosInstance {
    axiosInstance.interceptors.request.use(onRequest, onRequestError);
    axiosInstance.interceptors.response.use(onResponse, onResponseError);
    return axiosInstance;
}
