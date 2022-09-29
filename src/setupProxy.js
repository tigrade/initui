const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(createProxyMiddleware('/api', { 
      // target: 'http://192.168.3.131:3100/',
      target: 'http://127.0.0.1:3100/',
      changeOrigin: true,
      pathRewrite: {
        "^/api": "/"
      }
    }));
    
};