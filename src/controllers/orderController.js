/**
 * @fileoverview Controlador para manejar órdenes TWAP
 * @module controllers/orderController
 */

const signatureService = require('../services/signatureService');
const encryptionService = require('../services/encryptionService');
const twapService = require('../services/twapService');
const { RESPONSE_MESSAGES } = require('../config/constants');

/**
 * Clase controladora de órdenes
 */
class OrderController {
  /**
   * Procesa una orden TWAP encriptada y firmada
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   * @returns {Promise<void>}
   */
  async processOrder(req, res) {
    const { 
      walletAddress, 
      messageToVerify, 
      signature, 
      encryptedOrder 
    } = req.body;

    try {
      // 1. Validar datos de autenticación
      if (!walletAddress || !messageToVerify || !signature) {
        return res.status(400).json({ 
          success: false,
          message: RESPONSE_MESSAGES.MISSING_AUTH 
        });
      }

      // 2. Validar orden encriptada
      if (!encryptedOrder) {
        return res.status(400).json({ 
          success: false,
          message: RESPONSE_MESSAGES.MISSING_ORDER 
        });
      }

      // 3. Verificar firma criptográfica
      console.log('🔐 Verificando firma criptográfica...');
      const verificationResult = signatureService.verifySignature(
        messageToVerify, 
        signature, 
        walletAddress
      );

      if (!verificationResult.isValid) {
        console.error('❌ VERIFICACIÓN FALLIDA');
        return res.status(403).json({
          success: false,
          message: RESPONSE_MESSAGES.INVALID_SIGNATURE,
          expectedAddress: walletAddress,
          signerAddress: verificationResult.signerAddress
        });
      }

      console.log('✅ Firma verificada correctamente');

      // 4. Desencriptar la orden
      let orderData;
      try {
        orderData = encryptionService.decryptOrder(encryptedOrder);
        encryptionService.validateOrderStructure(orderData);
      } catch (decryptError) {
        console.error('❌ Error en desencriptación:', decryptError);
        return res.status(400).json({
          success: false,
          message: RESPONSE_MESSAGES.DECRYPTION_ERROR,
          error: decryptError.message
        });
      }

      // 5. Simular ejecución TWAP
      console.log('📊 Ejecutando simulación TWAP...');
      const simulationResults = twapService.simulateExecution(orderData);

      // 6. Responder con éxito
      return res.status(200).json({
        success: true,
        message: RESPONSE_MESSAGES.SUCCESS,
        verificationStatus: 'SUCCESS',
        walletAddress: walletAddress,
        results: simulationResults
      });

    } catch (error) {
      console.error('❌ Error procesando orden:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  /**
   * Obtiene el estado del servicio
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   */
  getHealth(req, res) {
    res.status(200).json({
      success: true,
      message: 'Servidor Anti-MEV funcionando correctamente',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  }
}

// Exportar instancia singleton
module.exports = new OrderController();
