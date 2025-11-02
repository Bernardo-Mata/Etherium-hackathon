/**
 * @fileoverview Servicio de simulación de ejecución TWAP
 * @module services/twapService
 */

const { IDEAL_PRICE, MEV_SLIPPAGE_PENALTY_RATE } = require('../config/constants');

/**
 * Clase para simular ejecución de órdenes TWAP
 */
class TwapService {
  /**
   * Simula la ejecución de una orden TWAP
   * @param {Object} order - Orden a ejecutar
   * @param {number} order.amount - Monto a intercambiar
   * @param {string} order.tokenIn - Token de entrada
   * @param {string} order.tokenOut - Token de salida
   * @param {number} order.duration - Duración en horas
   * @returns {Object} Resultados de la simulación
   */
  simulateExecution(order) {
    console.log('🔄 Iniciando simulación TWAP...');
    
    const inputAmount = parseFloat(order.amount);
    
    // Calcular output ideal (sin MEV)
    const totalOutputIdeal = inputAmount * IDEAL_PRICE;
    
    // Calcular output con slippage por MEV
    const totalOutputNormal = totalOutputIdeal * (1 - MEV_SLIPPAGE_PENALTY_RATE);
    
    // Calcular ahorro
    const savings = totalOutputIdeal - totalOutputNormal;

    console.log(`✅ Simulación completada:`);
    console.log(`   - Input: ${inputAmount} ${order.tokenIn}`);
    console.log(`   - Dark Pool Output: ${totalOutputIdeal.toFixed(2)} ${order.tokenOut}`);
    console.log(`   - Normal Swap Output: ${totalOutputNormal.toFixed(2)} ${order.tokenOut}`);
    console.log(`   - Ahorro: ${savings.toFixed(2)} ${order.tokenOut}`);

    return {
      totalInputAmount: order.amount,
      tokenIn: order.tokenIn,
      tokenOut: order.tokenOut,
      durationHours: order.duration,
      darkPoolOutput: totalOutputIdeal.toFixed(2),
      normalSwapOutput: totalOutputNormal.toFixed(2),
      totalSavings: savings.toFixed(2),
      encryptionUsed: 'Cifrado César (ROT13)'
    };
  }

  /**
   * Calcula el monto por porción para TWAP
   * @param {number} totalAmount - Monto total
   * @param {number} duration - Duración en horas
   * @returns {number} Monto por porción
   */
  calculatePortionAmount(totalAmount, duration) {
    return totalAmount / duration;
  }

  /**
   * Genera cronograma de ejecución TWAP
   * @param {Object} order - Orden TWAP
   * @returns {Array} Array de ejecuciones programadas
   */
  generateExecutionSchedule(order) {
    const portionAmount = this.calculatePortionAmount(
      parseFloat(order.amount), 
      parseInt(order.duration)
    );

    return Array.from({ length: parseInt(order.duration) }, (_, i) => ({
      hour: i + 1,
      amount: portionAmount,
      tokenIn: order.tokenIn,
      tokenOut: order.tokenOut,
      estimatedOutput: portionAmount * IDEAL_PRICE
    }));
  }
}

// Exportar instancia singleton
module.exports = new TwapService();
