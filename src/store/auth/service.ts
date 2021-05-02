export const setToken = (token: string) => {
    localStorage.setItem('access_token', token);
};

export const getToken = () => {
    return localStorage.getItem('access_token');
};

export const unsetToken = () => {
    localStorage.removeItem('access_token');
};

export const isLoggedIn = () => {
    return !!getToken();
};
