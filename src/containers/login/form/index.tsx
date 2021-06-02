import React, { useState } from 'react';
import style from './style.module.scss';
import logo from '../../../webhooks.svg';
import Button from '../../../components/button';
import { ObtainTokenQuery } from '../../../store/auth/requests';
import { useHistory } from 'react-router';
import Routes from '../../../utils/routes';
import { isLoggedIn } from '../../../store/auth/service';

export interface LoginForm {
    username: string;
    password: string;
}

export const LoginForm: React.FC = () => {
    const history = useHistory();

    if (isLoggedIn()) {
        history.push(Routes.Dashboard);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const submitForm = async (_) => {
        const token = await ObtainTokenQuery(loginFormState);
        if (token) {
            localStorage.setItem('access_token', token.access_token);
            history.push(Routes.Dashboard);
        } else {
            setFormError('Username or password is incorrect');
        }
    };

    const [loginFormState, setLoginFormState] = useState<LoginForm>({
        username: '',
        password: '',
    });

    const [formError, setFormError] = useState<string>('');

    return (
        <div className={style.login}>
            <form
                className={style.form}
                onSubmit={(e) => {
                    e.preventDefault();
                    submitForm(e);
                }}
            >
                <div className={style.logo}>
                    <img src={logo} className={style.logoImage} alt="logo" />
                </div>
                <div className={style.field}>
                    <label>Username</label>
                    <input
                        type="text"
                        name="name"
                        data-test="username"
                        className={style.input}
                        autoComplete="off"
                        value={loginFormState.username}
                        onChange={(e) => {
                            setFormError('');

                            setLoginFormState({
                                ...loginFormState,
                                username: e.target.value,
                            });
                        }}
                    ></input>
                </div>
                <div className={style.field}>
                    <label>Password</label>
                    <input
                        type="password"
                        name="name"
                        data-test="password"
                        className={style.input}
                        autoComplete="off"
                        value={loginFormState.password}
                        onChange={(e) => {
                            setFormError('');
                            setLoginFormState({
                                ...loginFormState,
                                password: e.target.value,
                            });
                        }}
                    ></input>
                </div>
                <div className={style.error}>{formError ?? ''}</div>
                <div>
                    <Button
                        style={style.button}
                        data-test="submitLogin"
                        handleClick={(e) => submitForm(e)}
                    >
                        Submit
                    </Button>
                </div>
            </form>
        </div>
    );
};
