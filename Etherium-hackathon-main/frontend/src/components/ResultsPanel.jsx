/**
 * @fileoverview Componente para mostrar resultados de la orden ejecutada
 * @module components/ResultsPanel
 */

import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { textStyles, panelStyles, specialStyles } from '../styles/componentStyles';
import { formatCurrency, formatAddress } from '../utils/format.utils';
import { DISPLAY_CONFIG } from '../constants/app.constants';

/**
 * Componente de tarjeta de comparación de resultados
 */
const ResultCard = ({ title, value, detail, isIdeal = false }) => {
  const cardStyle = isIdeal 
    ? { ...panelStyles.resultCard, ...panelStyles.idealCard }
    : { ...panelStyles.resultCard, ...panelStyles.normalCard };

  return (
    <div style={cardStyle}>
      <h3>{title}</h3>
      <p style={textStyles.value}>**{value}**</p>
      <p style={textStyles.detail}>{detail}</p>
    </div>
  );
};

/**
 * Componente de gráfico TWAP
 */
const TwapChart = ({ order }) => {
  const maxHours = Math.min(order.duration, DISPLAY_CONFIG.MAX_CHART_HOURS);
  const twapData = Array.from({ length: maxHours }, (_, i) => ({
    name: `${i + 1}h`,
    amount: order.amount / order.duration,
  }));

  return (
    <div style={specialStyles.chartContainer}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={twapData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="name" stroke="#999" />
          <YAxis stroke="#999" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #00ccff' }}
            labelStyle={{ color: '#fff' }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="amount" 
            stroke="#00ccff" 
            strokeWidth={2}
            name={`${order.tokenIn} por porción`}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * Componente de información de encriptación
 */
const EncryptionInfo = ({ encryptionUsed }) => {
  if (!encryptionUsed) return null;

  return (
    <div style={{ 
      marginTop: '20px', 
      padding: '15px', 
      border: '1px solid #00ff7f', 
      borderRadius: '8px', 
      backgroundColor: '#00ff7f1a' 
    }}>
      <h4 style={{ color: '#00ff7f', marginTop: '0' }}>🔒 Orden Encriptada</h4>
      <p style={{ margin: '5px 0' }}>
        <strong>Método:</strong> {encryptionUsed}
      </p>
      <p style={{ margin: '5px 0', fontSize: '0.9em', color: '#666' }}>
        Los datos de la orden fueron encriptados usando cifrado César (ROT13) antes de ser procesados.
        Esto ayuda a proteger la información sensible durante la transmisión.
      </p>
    </div>
  );
};

/**
 * Componente de recibo criptográfico
 */
const CryptographicReceipt = ({ signedData }) => {
  const [showReceipt, setShowReceipt] = useState(false);

  if (!signedData) return null;

  return (
    <div style={{ 
      marginTop: '20px', 
      padding: '15px', 
      border: '1px solid #00ccff', 
      borderRadius: '8px', 
      backgroundColor: '#00ccff1a' 
    }}>
      <button 
        onClick={() => setShowReceipt(!showReceipt)} 
        style={{ 
          background: 'none', 
          border: 'none', 
          color: '#00ccff', 
          cursor: 'pointer', 
          fontWeight: 'bold' 
        }}
      >
        {showReceipt ? 'Ocultar' : 'Ver'} Recibo Criptográfico
      </button>
      
      {showReceipt && (
        <div style={{ marginTop: '10px', fontSize: '0.9em' }}>
          <h4 style={{ color: '#fff' }}>Detalles de la Firma:</h4>
          <p style={{ margin: '5px 0', wordBreak: 'break-all' }}>
            <strong>Dirección:</strong>{' '}
            <code style={{ color: '#00ff7f' }}>{signedData.walletAddress}</code>
          </p>
          <p style={{ margin: '5px 0', wordBreak: 'break-all' }}>
            <strong>Firma:</strong>{' '}
            <code style={{ color: '#ccc' }}>
              {signedData.signature.substring(0, 60)}...
            </code>
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * Componente principal del panel de resultados
 * @param {Object} props - Props del componente
 * @param {Object} props.results - Resultados de la orden
 * @param {Object} props.order - Datos de la orden
 * @param {Object} props.signedData - Datos de firma
 * @param {Function} props.onNewOrder - Callback para nueva orden
 */
export const ResultsPanel = ({ results, order, signedData, onNewOrder }) => {
  if (!results || !signedData) return null;

  return (
    <div style={{ padding: '30px 0' }}>
      <h2 style={textStyles.sectionTitle}>✨ ¡Orden Privada Ejecutada con Éxito!</h2>
      <p style={textStyles.sectionSubtitle}>
        Orden para **{formatAddress(signedData.walletAddress)}** ejecutada de forma privada.
      </p>
      
      <div style={specialStyles.comparisonGrid}>
        <ResultCard 
          title="🚀 Dark Pool (Anti-MEV)"
          value={`${formatCurrency(results.darkPoolOutput)} USDC`}
          detail="Precio ideal sin deslizamiento"
          isIdeal={true}
        />
        
        <ResultCard 
          title="❌ Swap Estándar"
          value={`${formatCurrency(results.normalSwapOutput)} USDC`}
          detail="Con 3% de pérdida por MEV"
          isIdeal={false}
        />
      </div>

      <div style={specialStyles.savingsHighlight}>
        <h3>💰 ¡Ahorro Total Preservado!</h3>
        <p style={specialStyles.savingsValue}>
          {formatCurrency(results.totalSavings)} USDC
        </p>
        <p>Valor preservado usando ejecución privada</p>
      </div>

      <TwapChart order={order} />
      
      <EncryptionInfo encryptionUsed={results.encryptionUsed} />
      
      <CryptographicReceipt signedData={signedData} />

      <button 
        onClick={onNewOrder} 
        style={{
          ...specialStyles.savingsHighlight,
          cursor: 'pointer',
          marginTop: '20px',
          backgroundColor: '#00ccff',
          color: '#000',
          fontWeight: 'bold',
          border: 'none',
          padding: '15px',
          borderRadius: '10px'
        }}
      >
        Cargar Nueva Orden
      </button>
    </div>
  );
};

export default ResultsPanel;
