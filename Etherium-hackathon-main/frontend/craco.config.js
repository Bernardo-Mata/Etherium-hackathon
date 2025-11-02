// craco.config.js
const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Agrega la configuración de fallback para 'process/browser'
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "process/browser": require.resolve("process/browser"),
      };
      return webpackConfig;
    },
  },
};