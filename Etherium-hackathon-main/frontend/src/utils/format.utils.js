/**
 * @fileoverview Utilidades de formateo de datos
 * @module utils/format
 */

import { DISPLAY_CONFIG } from '../constants/app.constants';

/**
 * Formatea una dirección de wallet para mostrar
 * @param {string} address - Dirección completa
 * @param {number} [prefixLength=6] - Longitud del prefijo
 * @param {number} [suffixLength=4] - Longitud del sufijo
 * @returns {string} Dirección formateada (ej: 0x1234...5678)
 * 
 * @example
 * formatAddress('0x1234567890abcdef') // '0x1234...cdef'
 */
export const formatAddress = (
  address, 
  prefixLength = DISPLAY_CONFIG.ADDRESS_PREFIX_LENGTH,
  suffixLength = DISPLAY_CONFIG.ADDRESS_SUFFIX_LENGTH
) => {
  if (!address) return '';
  if (address.length <= prefixLength + suffixLength) return address;
  
  return `${address.substring(0, prefixLength)}...${address.substring(address.length - suffixLength)}`;
};

/**
 * Formatea un número como moneda
 * @param {number|string} value - Valor a formatear
 * @param {number} [decimals=2] - Número de decimales
 * @param {string} [locale='es-ES'] - Locale para formateo
 * @returns {string} Valor formateado
 * 
 * @example
 * formatCurrency(1234.5) // '1,234.50'
 */
export const formatCurrency = (
  value, 
  decimals = DISPLAY_CONFIG.CURRENCY_DECIMALS,
  locale = 'es-ES'
) => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return '0.00';
  
  return numValue.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

/**
 * Formatea un balance de ETH
 * @param {number|string} balance - Balance en ETH
 * @param {number} [decimals=4] - Número de decimales
 * @returns {string} Balance formateado
 * 
 * @example
 * formatBalance(1.23456789) // '1.2346'
 */
export const formatBalance = (
  balance, 
  decimals = DISPLAY_CONFIG.BALANCE_DECIMALS
) => {
  const numBalance = typeof balance === 'string' ? parseFloat(balance) : balance;
  
  if (isNaN(numBalance)) return '0.0000';
  
  return numBalance.toFixed(decimals);
};

/**
 * Formatea un timestamp a fecha legible
 * @param {number} timestamp - Timestamp en milisegundos
 * @param {string} [locale='es-ES'] - Locale para formateo
 * @returns {string} Fecha formateada
 */
export const formatDate = (timestamp, locale = 'es-ES') => {
  const date = new Date(timestamp);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Formatea un porcentaje
 * @param {number} value - Valor decimal (ej: 0.03 para 3%)
 * @param {number} [decimals=2] - Decimales a mostrar
 * @returns {string} Porcentaje formateado
 */
export const formatPercentage = (value, decimals = 2) => {
  return `${(value * 100).toFixed(decimals)}%`;
};
