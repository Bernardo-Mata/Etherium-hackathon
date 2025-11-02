/**
 * @fileoverview Middleware para manejo de errores
 * @module middlewares/errorHandler
 */

/**
 * Middleware de manejo de errores
 * @param {Error} err - Error capturado
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 * @param {Function} next - Next middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error capturado:', err);

  // Determinar el código de estado
  const statusCode = err.statusCode || 500;

  // Respuesta de error
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? {
      stack: err.stack,
      details: err.details
    } : undefined,
    timestamp: new Date().toISOString()
  });
};

/**
 * Middleware para rutas no encontradas
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 */
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.url}`,
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  errorHandler,
  notFound
};
