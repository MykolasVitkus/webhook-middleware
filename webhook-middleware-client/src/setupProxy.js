const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv-flow').config();
const axios = require('axios');
const bodyParser = require('body-parser');
const querystring = require('query-string');

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

    const rewriteContentType = (proxyReq, req, res) => {
        if (!req.body || !Object.keys(req.body).length) {
            return;
        }
    
        const contentType = proxyReq.getHeader('Content-Type');
        const writeBody = (bodyData) => {
            proxyReq.setHeader('Content-Type', 'application/json');
            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
            proxyReq.write(bodyData);
        };
    
        if (contentType.includes('application/json') || contentType.includes('application/x-www-form-urlencoded')) {
            writeBody(JSON.stringify(req.body));
        }
    
        if (contentType.includes('text/plain')) {
            writeBody(req.body);
        }
    };

    app.use(bodyParser.text());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    app.use(
        '/api',
        createProxyMiddleware({
            target: process.env.SERVER_URL,
            changeOrigin: true,
            pathRewrite: {
                '/api': '',
            },
            ws: true,
            onProxyReq: rewriteContentType,
        }),
    );
};
