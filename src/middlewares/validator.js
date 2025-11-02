/**
 * @fileoverview Middleware de validación de datos de entrada
 * @module middlewares/validator
 */

/**
 * Valida los datos de una orden
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 * @param {Function} next - Next middleware
 */
const validateOrderData = (req, res, next) => {
  const { walletAddress, messageToVerify, signature, encryptedOrder } = req.body;

  const errors = [];

  // Validar walletAddress
  if (!walletAddress) {
    errors.push('walletAddress es requerido');
  } else if (typeof walletAddress !== 'string' || !walletAddress.startsWith('0x')) {
    errors.push('walletAddress debe ser una dirección Ethereum válida');
  }

  // Validar messageToVerify
  if (!messageToVerify) {
    errors.push('messageToVerify es requerido');
  } else if (typeof messageToVerify !== 'string') {
    errors.push('messageToVerify debe ser un string');
  }

  // Validar signature
  if (!signature) {
    errors.push('signature es requerida');
  } else if (typeof signature !== 'string' || !signature.startsWith('0x')) {
    errors.push('signature debe ser una firma válida');
  }

  // Validar encryptedOrder
  if (!encryptedOrder) {
    errors.push('encryptedOrder es requerida');
  } else if (typeof encryptedOrder !== 'string') {
    errors.push('encryptedOrder debe ser un string');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      errors
    });
  }

  next();
};

/**
 * Valida el tamaño del body
 * @param {number} maxSize - Tamaño máximo en bytes
 */
const validateBodySize = (maxSize = 1024 * 100) => { // 100KB por defecto
  return (req, res, next) => {
    const contentLength = parseInt(req.headers['content-length'] || '0');
    
    if (contentLength > maxSize) {
      return res.status(413).json({
        success: false,
        message: `El tamaño del body excede el límite de ${maxSize} bytes`
      });
    }
    
    next();
  };
};

module.exports = {
  validateOrderData,
  validateBodySize
};
