/**
 * @fileoverview Componente de formulario para crear órdenes TWAP
 * @module components/OrderFormFields
 */

import React from 'react';
import { formStyles, textStyles } from '../styles/componentStyles';
import { ORDER_LIMITS, STATUS_MESSAGES } from '../constants/app.constants';

/**
 * Componente de campo de entrada con label
 * @param {Object} props - Props del componente
 */
const InputField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  type = 'text',
  min,
  max,
  step,
  readOnly = false,
  error,
  style = {},
  tokenLabel,
  isError = false
}) => {
  return (
    <div style={formStyles.inputGroup}>
      <label style={{ 
        ...formStyles.label, 
        color: isError ? '#ff4d4d' : formStyles.label.color 
      }}>
        {label} {error && `(${error})`}
      </label>
      <input 
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        readOnly={readOnly}
        style={{ 
          ...formStyles.input, 
          ...style,
          border: isError ? '1px solid #ff4d4d' : formStyles.input.border 
        }}
      />
      {tokenLabel && (
        <span style={formStyles.tokenLabel}>{tokenLabel}</span>
      )}
    </div>
  );
};

/**
 * Componente de toggle para modo demo
 */
const DemoModeToggle = ({ demoMode, onToggle }) => {
  return (
    <div style={{ 
      padding: '15px', 
      backgroundColor: demoMode ? '#00ff7f1a' : '#ffcc001a', 
      border: `1px solid ${demoMode ? '#00ff7f' : '#ffcc00'}`, 
      borderRadius: '8px', 
      marginBottom: '20px' 
    }}>
      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
        <input 
          type="checkbox" 
          checked={demoMode} 
          onChange={onToggle} 
          style={{ marginRight: '10px', transform: 'scale(1.3)' }}
        />
        <span style={{ 
          color: demoMode ? '#00ff7f' : '#ffcc00', 
          fontWeight: 'bold' 
        }}>
          🎮 Modo Demo (Probar sin ETH real)
        </span>
      </label>
      {demoMode && (
        <p style={{ 
          color: '#999', 
          fontSize: '12px', 
          marginTop: '8px', 
          marginBottom: 0 
        }}>
          {STATUS_MESSAGES.DEMO_MODE_ACTIVE}
        </p>
      )}
    </div>
  );
};

/**
 * Componente de alerta de red incorrecta
 */
const NetworkAlert = ({ chainId, targetChainId }) => {
  if (!chainId || chainId === targetChainId) return null;

  return (
    <div style={{ 
      padding: '10px', 
      backgroundColor: '#ff99001a', 
      border: '1px solid #ff9900', 
      borderRadius: '8px', 
      marginBottom: '15px' 
    }}>
      <p style={{ color: '#ff9900', margin: 0 }}>
        ⚠️ Estás en la red {chainId}. Cambia a **Ethereum Mainnet** (Chain ID: {targetChainId})
      </p>
    </div>
  );
};

/**
 * Componente principal de campos del formulario de órdenes
 * @param {Object} props - Props del componente
 */
export const OrderFormFields = ({ 
  order,
  ethBalance,
  demoMode,
  chainId,
  targetChainId,
  onChange,
  onSubmit,
  onDemoModeToggle,
  isSubmitting = false,
  errors = {}
}) => {
  const isBalanceInsufficient = !demoMode && parseFloat(order.amount) > parseFloat(ethBalance);
  const buttonDisabled = isSubmitting || (!demoMode && isBalanceInsufficient) || (chainId !== null && chainId !== targetChainId);

  return (
    <div>
      <h2 style={textStyles.sectionTitle}>Cargar Orden TWAP Privada</h2>
      <p style={textStyles.sectionSubtitle}>
        Define una orden para evitar que los bots MEV roben tu alfa
      </p>

      <form onSubmit={onSubmit}>
        <DemoModeToggle demoMode={demoMode} onToggle={onDemoModeToggle} />

        <InputField
          label="Saldo ETH (Real)"
          name="ethBalance"
          value={`${ethBalance} ETH`}
          readOnly={true}
          style={{ ...formStyles.input, ...formStyles.balanceDisplay }}
        />

        <InputField
          label="Monto a Vender"
          name="amount"
          type="number"
          value={order.amount}
          onChange={onChange}
          min={ORDER_LIMITS.MIN_AMOUNT}
          step={ORDER_LIMITS.AMOUNT_STEP}
          tokenLabel={order.tokenIn}
          isError={isBalanceInsufficient && !demoMode}
          error={isBalanceInsufficient && !demoMode ? STATUS_MESSAGES.INSUFFICIENT_BALANCE : errors.amount}
        />

        <InputField
          label="Token a Comprar"
          name="tokenOut"
          value={order.tokenOut}
          onChange={onChange}
          error={errors.tokenOut}
        />

        <InputField
          label="Duración (horas)"
          name="duration"
          type="number"
          value={order.duration}
          onChange={onChange}
          min={ORDER_LIMITS.MIN_DURATION}
          error={errors.duration}
        />

        <NetworkAlert chainId={chainId} targetChainId={targetChainId} />

        <button 
          type="submit"
          disabled={buttonDisabled}
          style={{
            ...formStyles.submitOrderButton,
            opacity: buttonDisabled ? 0.5 : 1,
            cursor: buttonDisabled ? 'not-allowed' : 'pointer',
            backgroundColor: demoMode ? '#00ff7f' : '#00ccff'
          }}
        >
          {isSubmitting 
            ? 'Procesando...' 
            : demoMode 
              ? '🎮 Firmar Orden Demo' 
              : 'Firmar y Enviar Orden Privada'
          }
        </button>
      </form>
    </div>
  );
};

export default OrderFormFields;
