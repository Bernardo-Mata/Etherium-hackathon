/**
 * @fileoverview Configuración de blockchain para la aplicación Anti-MEV Dark Pool
 * @module config/blockchain
 */

/**
 * Configuración de redes blockchain soportadas
 * @constant {Object}
 */
export const NETWORKS = {
  ETHEREUM_MAINNET: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://eth.llamarpc.com',
    explorerUrl: 'https://etherscan.io'
  },
  SCROLL: {
    chainId: 534352,
    name: 'Scroll Mainnet',
    rpcUrl: 'https://rpc.scroll.io',
    explorerUrl: 'https://scrollscan.com'
  },
  SCROLL_SEPOLIA: {
    chainId: 534351,
    name: 'Scroll Sepolia',
    rpcUrl: 'https://sepolia-rpc.scroll.io',
    explorerUrl: 'https://sepolia.scrollscan.com'
  },
  ARBITRUM: {
    chainId: 42161,
    name: 'Arbitrum One',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorerUrl: 'https://arbiscan.io'
  },
  ARBITRUM_SEPOLIA: {
    chainId: 421614,
    name: 'Arbitrum Sepolia',
    rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
    explorerUrl: 'https://sepolia.arbiscan.io'
  }
};

/**
 * Red predeterminada para la aplicación
 * @constant {number}
 */
export const DEFAULT_CHAIN_ID = NETWORKS.ETHEREUM_MAINNET.chainId;

/**
 * Obtiene la configuración de una red por su chainId
 * @param {number} chainId - ID de la cadena
 * @returns {Object|null} Configuración de la red o null si no existe
 */
export const getNetworkConfig = (chainId) => {
  return Object.values(NETWORKS).find(network => network.chainId === chainId) || null;
};

/**
 * Valida si un chainId es soportado
 * @param {number} chainId - ID de la cadena a validar
 * @returns {boolean} true si la red es soportada
 */
export const isSupportedNetwork = (chainId) => {
  return Object.values(NETWORKS).some(network => network.chainId === chainId);
};
