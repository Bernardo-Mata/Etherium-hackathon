/**
 * @fileoverview Servidor principal de la aplicación Anti-MEV Dark Pool
 * @module server
 * @author Anti-MEV Team
 * @version 1.0.0
 */

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { PORT, corsOptions } = require('./src/config/server.config');
const orderRoutes = require('./src/routes/orderRoutes');
const logger = require('./src/middlewares/logger');
const { errorHandler, notFound } = require('./src/middlewares/errorHandler');
const { validateBodySize } = require('./src/middlewares/validator');

// Inicializar aplicación Express
const app = express();

/**
 * Configuración de middlewares
 */
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(validateBodySize(1024 * 100)); // 100KB máximo
app.use(logger);

/**
 * Ruta raíz
 */
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Servidor Anti-MEV Dark Pool API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            processOrder: 'POST /api/orden'
        },
        documentation: 'https://github.com/tu-repo/README.md'
    });
});

/**
 * Rutas de la API
 */
app.use('/api', orderRoutes);

/**
 * Middleware de rutas no encontradas (404)
 */
app.use(notFound);

/**
 * Middleware de manejo de errores
 */
app.use(errorHandler);

/**
 * Iniciar servidor
 */
app.listen(PORT, () => {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🚀 Servidor Anti-MEV Dark Pool iniciado correctamente');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`📡 Escuchando en: http://localhost:${PORT}`);
    console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📚 Endpoints disponibles:');
    console.log(`   GET  / - Información del servidor`);
    console.log(`   GET  /api/health - Estado del servidor`);
    console.log(`   POST /api/orden - Procesar orden TWAP`);
    console.log('═══════════════════════════════════════════════════════════');
});

/**
 * Manejo de cierre graceful
 */
process.on('SIGTERM', () => {
    console.log('📴 SIGTERM recibido. Cerrando servidor...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('📴 SIGINT recibido. Cerrando servidor...');
    process.exit(0);
});

module.exports = app;
