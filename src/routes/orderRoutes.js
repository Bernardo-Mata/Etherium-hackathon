/**
 * @fileoverview Rutas de la API de órdenes
 * @module routes/orderRoutes
 */

const express = require('express');
const orderController = require('../controllers/orderController');
const { validateOrderData } = require('../middlewares/validator');

const router = express.Router();

/**
 * POST /api/orden
 * Procesa una orden TWAP encriptada y firmada
 */
router.post('/orden', validateOrderData, (req, res) => {
  orderController.processOrder(req, res);
});

/**
 * GET /api/health
 * Verifica el estado del servidor
 */
router.get('/health', (req, res) => {
  orderController.getHealth(req, res);
});

module.exports = router;
