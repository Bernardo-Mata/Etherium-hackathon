/**
 * @fileoverview Custom hook para manejar el formulario de órdenes
 * @module hooks/useOrderForm
 */

import { useState, useCallback } from 'react';
import { DEFAULT_ORDER_VALUES, ORDER_LIMITS } from '../constants/app.constants';

/**
 * Hook personalizado para manejar el formulario de órdenes TWAP
 * @returns {Object} Estado y funciones del formulario
 */
export const useOrderForm = () => {
  const [order, setOrder] = useState(DEFAULT_ORDER_VALUES);
  const [errors, setErrors] = useState({});

  /**
   * Valida un campo del formulario
   * @param {string} field - Nombre del campo
   * @param {any} value - Valor a validar
   * @returns {string|null} Mensaje de error o null si es válido
   */
  const validateField = useCallback((field, value) => {
    switch (field) {
      case 'amount':
        const amount = parseFloat(value);
        if (isNaN(amount) || amount < ORDER_LIMITS.MIN_AMOUNT) {
          return `El monto mínimo es ${ORDER_LIMITS.MIN_AMOUNT} ETH`;
        }
        if (amount > ORDER_LIMITS.MAX_AMOUNT) {
          return `El monto máximo es ${ORDER_LIMITS.MAX_AMOUNT} ETH`;
        }
        return null;

      case 'duration':
        const duration = parseInt(value);
        if (isNaN(duration) || duration < ORDER_LIMITS.MIN_DURATION) {
          return `La duración mínima es ${ORDER_LIMITS.MIN_DURATION} hora`;
        }
        if (duration > ORDER_LIMITS.MAX_DURATION) {
          return `La duración máxima es ${ORDER_LIMITS.MAX_DURATION} horas`;
        }
        return null;

      case 'tokenIn':
      case 'tokenOut':
        if (!value || value.trim().length === 0) {
          return 'El token es requerido';
        }
        return null;

      default:
        return null;
    }
  }, []);

  /**
   * Maneja el cambio de un campo del formulario
   * @param {string} field - Nombre del campo
   * @param {any} value - Nuevo valor
   */
  const handleChange = useCallback((field, value) => {
    setOrder(prev => ({ ...prev, [field]: value }));
    
    // Validar el campo
    const error = validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  }, [validateField]);

  /**
   * Maneja el cambio desde un evento de input
   * @param {Event} e - Evento del input
   */
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    handleChange(name, value);
  }, [handleChange]);

  /**
   * Valida todo el formulario
   * @returns {boolean} true si el formulario es válido
   */
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    Object.keys(order).forEach(field => {
      const error = validateField(field, order[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [order, validateField]);

  /**
   * Resetea el formulario a los valores por defecto
   */
  const resetForm = useCallback(() => {
    setOrder(DEFAULT_ORDER_VALUES);
    setErrors({});
  }, []);

  /**
   * Verifica si el formulario tiene errores
   * @returns {boolean} true si hay errores
   */
  const hasErrors = useCallback(() => {
    return Object.values(errors).some(error => error !== null);
  }, [errors]);

  return {
    order,
    errors,
    handleChange,
    handleInputChange,
    validateForm,
    resetForm,
    hasErrors,
    setOrder,
  };
};

export default useOrderForm;
