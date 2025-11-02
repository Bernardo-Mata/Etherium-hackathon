/**
 * @fileoverview Configuración del servidor y la aplicación
 * @module config/server
 */

/**
 * Puerto del servidor
 * @constant {number}
 */
export const PORT = process.env.PORT || 3001;

/**
 * Configuración de CORS
 * @constant {Object}
 */
export const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  optionsSuccessStatus: 200,
  credentials: true
};

/**
 * Configuración del servidor
 * @constant {Object}
 */
export const serverConfig = {
  port: PORT,
  env: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info'
};

/**
 * Configuración de blockchain
 * @constant {Object}
 */
export const blockchainConfig = {
  ethereumRpc: process.env.ETHEREUM_RPC_URL || 'https://eth.llamarpc.com',
  scrollRpc: process.env.SCROLL_RPC_URL || 'https://rpc.scroll.io'
};

module.exports = {
  PORT,
  corsOptions,
  serverConfig,
  blockchainConfig
};
