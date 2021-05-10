const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv-flow').config();
const axios = require('axios');

module.exports = function (app) {
    axios.interceptors.response.use(
        function (response) {
            return response;
        },
        function (error) {
            console.log(error);
            return Promise.reject(error);
        },
    );
    app.use(
        '/api',
        createProxyMiddleware({
            target: process.env.SERVER_URL,
            changeOrigin: true,
            pathRewrite: {
                '/api': '',
            },
            ws: true,
        }),
    );
};
