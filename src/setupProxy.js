const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://bakis_app_1:3001',
      changeOrigin: true,
      pathRewrite: {
        '/api': '/'
      }
    })
  );
};