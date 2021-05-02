import axios, { AxiosResponse } from 'axios';
import { LoginForm } from '../../containers/login/form';

interface AccessToken {
    access_token: string;
}

interface ObtainTokenResponse extends AxiosResponse {
    data: AccessToken;
}

export const ObtainTokenQuery: (
    credentials: LoginForm,
) => Promise<AccessToken | void> = (credentials) =>
    axios
        .post('/api/auth/login', credentials, {
            headers: { 'Content-Type': 'application/json' },
        })
        .then((res: ObtainTokenResponse) => {
            return res.data;
        })
        .catch((error) => {
            console.log(error);
        });
