/**
 * @fileoverview Constantes de la aplicación Anti-MEV Dark Pool
 * @module constants/app
 */

/**
 * Precio simulado de ETH en USDC para cálculos
 * @constant {number}
 */
export const ETH_PRICE_USD = 3000;

/**
 * Tasa de penalización por slippage de MEV (3%)
 * @constant {number}
 */
export const MEV_SLIPPAGE_RATE = 0.03;

/**
 * Shift por defecto para cifrado César
 * @constant {number}
 */
export const DEFAULT_CAESAR_SHIFT = 13;

/**
 * Tokens soportados para trading
 * @constant {Array<string>}
 */
export const SUPPORTED_TOKENS = ['ETH', 'USDC', 'USDT', 'DAI', 'WETH'];

/**
 * Valores por defecto para órdenes
 * @constant {Object}
 */
export const DEFAULT_ORDER_VALUES = {
  amount: 0.0001,
  tokenIn: 'ETH',
  tokenOut: 'USDC',
  duration: 48
};

/**
 * Límites para validación de órdenes
 * @constant {Object}
 */
export const ORDER_LIMITS = {
  MIN_AMOUNT: 0.0001,
  MAX_AMOUNT: 1000,
  MIN_DURATION: 1,
  MAX_DURATION: 168, // 7 días en horas
  AMOUNT_STEP: 0.0001
};

/**
 * Mensajes de estado de la aplicación
 * @constant {Object}
 */
export const STATUS_MESSAGES = {
  WALLET_NOT_INSTALLED: '❌ MetaMask no está instalado. Por favor instálalo desde metamask.io',
  CONNECTING_WALLET: '🔄 Conectando a MetaMask...',
  WALLET_CONNECTED: '✅ Conectado',
  WALLET_DISCONNECTED: 'Billetera desconectada',
  CONNECTION_REJECTED: 'Conexión rechazada por el usuario',
  REQUESTING_SIGNATURE: '1. Solicitando firma...',
  SIGNATURE_GENERATED: '2. Firma generada. Simulando resultados...',
  SIGNATURE_REJECTED: 'Firma rechazada por el usuario',
  ORDER_PROCESSING: '✅ Orden procesada exitosamente',
  INSUFFICIENT_BALANCE: 'Saldo insuficiente',
  WRONG_NETWORK: 'Por favor, cambia a la red correcta',
  DEMO_MODE_ACTIVE: '✅ Activo: Puedes firmar órdenes sin tener saldo ETH'
};

/**
 * Configuración de visualización
 * @constant {Object}
 */
export const DISPLAY_CONFIG = {
  BALANCE_DECIMALS: 4,
  CURRENCY_DECIMALS: 2,
  ADDRESS_PREFIX_LENGTH: 6,
  ADDRESS_SUFFIX_LENGTH: 4,
  MAX_CHART_HOURS: 24
};
