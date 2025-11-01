// config-overrides.js

const webpack = require('webpack');
const { override } = require('customize-cra');

// Función principal para modificar la configuración de Webpack
module.exports = override(
    (config) => {
        const fallback = config.resolve.fallback || {};
        Object.assign(fallback, {
            // Asigna los polyfills a los módulos de Node.js faltantes
            "crypto": require.resolve("crypto-browserify"),
            "stream": require.resolve("stream-browserify"),
            "assert": require.resolve("assert"),
            "http": require.resolve("stream-http"),
            "https": require.resolve("https-browserify"),
            "os": require.resolve("os-browserify/browser"),
            "url": require.resolve("url"),
            "path": require.resolve("path-browserify"),
            "zlib": require.resolve("browserify-zlib"), // Añadido un polyfill común
            "buffer": require.resolve("buffer"), // Añadido para manejo global
            "process": require.resolve("process/browser"), // Añadido para manejo global
            "fs": false,
            "net": false,
            "tls": false
        });
        
        config.resolve.fallback = fallback;

        // Añadir plugins para hacer Buffer y Process accesibles globalmente (clave para Ethereum libs)
        config.plugins = (config.plugins || []).concat([
            new webpack.ProvidePlugin({
                process: 'process/browser',
                Buffer: ['buffer', 'Buffer'],
            }),
        ]);

        return config;
    }
);