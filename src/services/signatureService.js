/**
 * @fileoverview Servicio de verificación de firmas criptográficas
 * @module services/signatureService
 */

const { ethers } = require('ethers');

/**
 * Clase para manejar la verificación de firmas
 */
class SignatureService {
  /**
   * Verifica una firma criptográfica
   * @param {string} message - Mensaje original que fue firmado
   * @param {string} signature - Firma a verificar
   * @param {string} expectedAddress - Dirección esperada del firmante
   * @returns {Object} Resultado de la verificación
   * @throws {Error} Si los parámetros son inválidos
   */
  verifySignature(message, signature, expectedAddress) {
    if (!message || !signature || !expectedAddress) {
      throw new Error('Parámetros inválidos: message, signature y expectedAddress son requeridos');
    }

    try {
      // Recuperar la dirección del firmante a partir del mensaje y la firma
      const signerAddress = ethers.verifyMessage(message, signature);

      console.log(`🔍 Dirección Recuperada: ${signerAddress}`);
      console.log(`🔍 Dirección Esperada: ${expectedAddress}`);

      // Comparar direcciones (case-insensitive)
      const isValid = signerAddress.toLowerCase() === expectedAddress.toLowerCase();

      return {
        isValid,
        signerAddress,
        expectedAddress,
        message: isValid 
          ? '✅ Firma válida - La orden fue autorizada por el propietario de la wallet'
          : '❌ Firma inválida - Las direcciones no coinciden'
      };
    } catch (error) {
      console.error('❌ Error verificando firma:', error);
      throw new Error(`Error en la verificación de firma: ${error.message}`);
    }
  }

  /**
   * Valida el formato de una dirección Ethereum
   * @param {string} address - Dirección a validar
   * @returns {boolean} true si la dirección es válida
   */
  isValidAddress(address) {
    try {
      return ethers.isAddress(address);
    } catch {
      return false;
    }
  }

  /**
   * Normaliza una dirección Ethereum (checksum)
   * @param {string} address - Dirección a normalizar
   * @returns {string} Dirección normalizada
   */
  normalizeAddress(address) {
    try {
      return ethers.getAddress(address);
    } catch (error) {
      throw new Error(`Dirección inválida: ${address}`);
    }
  }
}

// Exportar instancia singleton
module.exports = new SignatureService();
