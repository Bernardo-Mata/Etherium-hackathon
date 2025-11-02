/**
 * @fileoverview Servicio para comunicación con la API del backend
 * @module services/api
 */

import { API_BASE_URL, API_ENDPOINTS, API_TIMEOUT, DEFAULT_HEADERS } from '../config/api.config';

/**
 * Clase para manejar las peticiones a la API
 */
class ApiService {
  /**
   * Realiza una petición HTTP genérica
   * @private
   * @param {string} endpoint - Endpoint de la API
   * @param {Object} options - Opciones de la petición
   * @returns {Promise<Object>} Respuesta de la API
   * @throws {Error} Si la petición falla
   */
  async request(endpoint, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...DEFAULT_HEADERS,
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('La petición ha excedido el tiempo de espera');
      }
      
      throw error;
    }
  }

  /**
   * Envía una orden firmada al backend
   * @param {Object} orderData - Datos de la orden
   * @param {string} orderData.walletAddress - Dirección de la wallet
   * @param {string} orderData.messageToVerify - Mensaje firmado
   * @param {string} orderData.signature - Firma criptográfica
   * @param {string} orderData.encryptedOrder - Orden encriptada
   * @returns {Promise<Object>} Respuesta del servidor con los resultados
   * @throws {Error} Si la petición falla o los datos son inválidos
   */
  async submitOrder(orderData) {
    if (!orderData.walletAddress || !orderData.signature) {
      throw new Error('Faltan datos requeridos: walletAddress y signature');
    }

    return this.request(API_ENDPOINTS.ORDER, {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  /**
   * Verifica el estado de salud del servidor
   * @returns {Promise<Object>} Estado del servidor
   */
  async checkHealth() {
    return this.request(API_ENDPOINTS.HEALTH, {
      method: 'GET',
    });
  }
}

// Exportar instancia singleton
export default new ApiService();
