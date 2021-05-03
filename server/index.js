const { resolve } = require('path');
const history = require('connect-history-api-fallback');
const express = require('express');
const { GracefulShutdownManager } = require('@moebius/http-graceful-shutdown');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv-flow').config();

const app = express();

const PORT = 3000;

const options = {
    router: function(req) {
        return {
            protocol: '',
            host: process.env.SERVER_URL,
            port: 3001,
        }
    },
    target: process.env.SERVER_URL,
    changeOrigin: true,
    pathRewrite: {
        '/api': '',
    },
    ws: true,
};
const buildPath = resolve(__dirname, '../build');

// const proxy = {devServer: {
//     https: {
//       spdy: {
//         protocols: ['http/1.1'],
//       },
//     },
//     proxy: {
//       '/my-backend': {
//         changeOrigin: true,
//         pathRewrite: {'^/my-backend': ''},
//         target: myBackendUrl,
//         ws: true,
//       },
//     },
//   }
// };

const staticConf = {
    maxAge: '1y',
    etag: false,
    index: false,
    setHeaders: (res, path) => {
        if (path.includes('service-worker.js')) {
            res.setHeader(
                'Cache-Control',
                'no-store, no-cache, must-revalidate, private',
            );
        }
    },
};
app.use(express.static(buildPath, staticConf));

const proxyMiddleware = createProxyMiddleware(options);

// API proxy
app.use('/api', proxyMiddleware);

app.use('/', history());

// Used to remove verbosity of errors.
const errorHandler = function (err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    res.status(400).send('Something went wrong.');
};
app.use(errorHandler);

app.get('/*', (req, res) => {
    res.sendFile('index.html', {
        root: buildPath,
        headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, private',
            'x-timestamp': Date.now(),
        },
    });
});

// Go
const server = app.listen(PORT, () =>
    console.log(`App running on port ${PORT}!`),
);
const shutdownManager = new GracefulShutdownManager(server);

process.on('SIGTERM', () => {
    shutdownManager.terminate(() => {
        console.log('Server is gracefully terminated');
    });
});
