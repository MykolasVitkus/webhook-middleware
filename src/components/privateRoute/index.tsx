// This is used to determine if a user is authenticated and
// if they are allowed to visit the page they navigated to.

// If they are: they proceed to the page
// If not: they are redirected to the login page.
import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { isLoggedIn } from '../../store/auth/service';

// eslint-disable-next-line
export type PrivateRouteProps = {
    children: React.ReactNode;
} & RouteProps;

const PrivateRoute: React.FC<PrivateRouteProps> = (props) => {
    const authenticated = isLoggedIn();

    return authenticated ? (
        <Route {...props}>{props.children}</Route>
    ) : (
        <Redirect
            to={{
                pathname: '/login',
                state: { from: props.location },
            }}
        />
    );
};

export default PrivateRoute;
