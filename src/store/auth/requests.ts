import axios, { AxiosResponse } from 'axios';
import { LoginForm } from '../../containers/login/form';
import { setupInterceptorsTo } from '../../interceptors';
const axiosInstance = setupInterceptorsTo(axios.create());

interface AccessToken {
    access_token: string;
}

interface ObtainTokenResponse extends AxiosResponse {
    data: AccessToken;
}

export const ObtainTokenQuery: (
    credentials: LoginForm,
) => Promise<AccessToken | void> = (credentials) =>
    axiosInstance
        .post('/api/auth/login', credentials, {
            headers: { 'Content-Type': 'application/json' },
        })
        .then((res: ObtainTokenResponse) => {
            return res.data;
        })
        .catch((error) => {
            console.log(error);
        });
