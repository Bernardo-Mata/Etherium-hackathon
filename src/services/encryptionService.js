/**
 * @fileoverview Servicio de encriptación y desencriptación de órdenes
 * @module services/encryptionService
 */

const { decryptOrder, DEFAULT_SHIFT } = require('../utils/caesarCipher');

/**
 * Clase para manejar encriptación de órdenes
 */
class EncryptionService {
  /**
   * Desencripta una orden usando cifrado César
   * @param {string} encryptedOrder - Orden encriptada
   * @param {number} [shift=DEFAULT_SHIFT] - Shift usado en la encriptación
   * @returns {Object} Orden desencriptada
   * @throws {Error} Si la desencriptación falla
   */
  decryptOrder(encryptedOrder, shift = DEFAULT_SHIFT) {
    if (!encryptedOrder) {
      throw new Error('Orden encriptada no proporcionada');
    }

    try {
      console.log('🔓 Desencriptando orden...');
      const decrypted = decryptOrder(encryptedOrder, shift);
      console.log('✅ Orden desencriptada exitosamente');
      return decrypted;
    } catch (error) {
      console.error('❌ Error desencriptando orden:', error);
      throw new Error(`Error de desencriptación: ${error.message}`);
    }
  }

  /**
   * Valida que una orden desencriptada tenga los campos requeridos
   * @param {Object} order - Orden a validar
   * @returns {boolean} true si la orden es válida
   * @throws {Error} Si faltan campos requeridos
   */
  validateOrderStructure(order) {
    const requiredFields = ['amount', 'tokenIn', 'tokenOut', 'duration', 'timestamp'];
    const missingFields = requiredFields.filter(field => !(field in order));

    if (missingFields.length > 0) {
      throw new Error(`Campos faltantes en la orden: ${missingFields.join(', ')}`);
    }

    // Validaciones adicionales
    if (parseFloat(order.amount) <= 0) {
      throw new Error('El monto debe ser mayor a 0');
    }

    if (parseInt(order.duration) <= 0) {
      throw new Error('La duración debe ser mayor a 0');
    }

    return true;
  }
}

// Exportar instancia singleton
module.exports = new EncryptionService();
