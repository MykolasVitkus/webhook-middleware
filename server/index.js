const { resolve } = require('path');
const history = require('connect-history-api-fallback');
const express = require('express');
const { GracefulShutdownManager } = require('@moebius/http-graceful-shutdown');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv-flow').config();
const querystring = require('query-string');
const bodyParser = require('body-parser');

const app = express();

const PORT = 3000;

const buildPath = resolve(__dirname, '../build');

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

const options = {
    target: process.env.SERVER_URL,
    changeOrigin: true,
    pathRewrite: {
        '/api': '',
    },
    ws: true,
    onProxyReq: rewriteContentType,
};

// //Body parser
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// API proxy
const proxyMiddleware = createProxyMiddleware(options);

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
