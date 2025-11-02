/**
 * @fileoverview Constantes de la aplicación backend
 * @module config/constants
 */

/**
 * Precio simulado de ETH en USDC
 * @constant {number}
 */
const IDEAL_PRICE = 3000;

/**
 * Tasa de penalización por MEV (3%)
 * @constant {number}
 */
const MEV_SLIPPAGE_PENALTY_RATE = 0.03;

/**
 * Shift por defecto para cifrado César
 * @constant {number}
 */
const DEFAULT_SHIFT = 13;

/**
 * Mensajes de respuesta
 * @constant {Object}
 */
const RESPONSE_MESSAGES = {
  SUCCESS: 'Orden verificada, desencriptada y simulación TWAP completada',
  MISSING_AUTH: 'Faltan datos de autenticación (dirección, mensaje o firma)',
  MISSING_ORDER: 'Falta la orden encriptada',
  INVALID_SIGNATURE: '❌ Firma Inválida. La orden no fue autorizada por esta billetera',
  DECRYPTION_ERROR: '❌ Error: No se pudo desencriptar la orden. La orden puede estar corrupta',
  SIGNATURE_ERROR: '❌ Error: La firma no es válida o el mensaje está corrupto'
};

module.exports = {
  IDEAL_PRICE,
  MEV_SLIPPAGE_PENALTY_RATE,
  DEFAULT_SHIFT,
  RESPONSE_MESSAGES
};
