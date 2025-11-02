/**
 * @fileoverview Configuración de API para comunicación con el backend
 * @module config/api
 */

/**
 * URL base del servidor backend
 * @constant {string}
 */
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

/**
 * Endpoints de la API
 * @constant {Object}
 */
export const API_ENDPOINTS = {
  ORDER: '/api/orden',
  HEALTH: '/health'
};

/**
 * Tiempo de espera para las peticiones HTTP (en milisegundos)
 * @constant {number}
 */
export const API_TIMEOUT = 30000; // 30 segundos

/**
 * Configuración de headers por defecto para peticiones
 * @constant {Object}
 */
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};
