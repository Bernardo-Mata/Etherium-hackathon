/**
 * @fileoverview Componente de mensaje de estado global
 * @module components/StatusMessage
 */

import React, { useEffect, useState } from 'react';
import { specialStyles } from '../styles/componentStyles';

/**
 * Componente de mensaje de estado flotante
 * @param {Object} props - Props del componente
 * @param {string} props.message - Mensaje a mostrar
 * @param {number} [props.duration=0] - Duración en ms (0 = permanente)
 * @param {Function} [props.onDismiss] - Callback al cerrar el mensaje
 */
export const StatusMessage = ({ message, duration = 0, onDismiss }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (message) {
      setVisible(true);
      
      if (duration > 0) {
        const timer = setTimeout(() => {
          setVisible(false);
          if (onDismiss) {
            onDismiss();
          }
        }, duration);

        return () => clearTimeout(timer);
      }
    } else {
      setVisible(false);
    }
  }, [message, duration, onDismiss]);

  if (!visible || !message) {
    return null;
  }

  return (
    <div style={specialStyles.globalStatusMessage}>
      {message}
    </div>
  );
};

export default StatusMessage;
