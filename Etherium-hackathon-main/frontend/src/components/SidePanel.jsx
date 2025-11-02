/**
 * @fileoverview Componente de panel lateral con información adicional
 * @module components/SidePanel
 */

import React from 'react';
import { panelStyles, specialStyles, textStyles } from '../styles/componentStyles';

/**
 * Componente de placeholder cuando no está conectado
 */
const NotConnectedPlaceholder = () => (
  <div style={specialStyles.connectWalletPlaceholder}>
    <span style={{ fontSize: '3em', color: '#00ccff' }}>💳</span>
    <h3 style={{ color: '#fff' }}>Conectar Billetera</h3>
    <p style={{ color: '#999' }}>
      Conéctate para ver tu saldo real de ETH
    </p>
  </div>
);

/**
 * Componente de información de balance
 */
const BalanceInfo = ({ ethBalance, chainId }) => (
  <div style={specialStyles.connectWalletPlaceholder}>
    <span style={{ fontSize: '3em', color: '#ffcc00' }}>⏳</span>
    <h3>Saldo Cargado</h3>
    <p style={{ color: '#999' }}>
      Tu saldo: <strong style={{ color: '#00ccff' }}>{ethBalance} ETH</strong>
    </p>
    <p style={{ color: '#999', fontSize: '12px', marginTop: '10px' }}>
      Red: Chain ID {chainId || 'Desconocida'}
    </p>
  </div>
);

/**
 * Componente de análisis completo
 */
const AnalysisComplete = () => (
  <div style={specialStyles.connectWalletPlaceholder}>
    <span style={{ fontSize: '3em', color: '#00ff7f' }}>📊</span>
    <h3>Análisis Completo</h3>
    <p style={{ color: '#999' }}>
      Tu ahorro se muestra en el panel izquierdo
    </p>
  </div>
);

/**
 * Componente principal del panel lateral
 * @param {Object} props - Props del componente
 * @param {boolean} props.isConnected - Si la wallet está conectada
 * @param {string} props.ethBalance - Balance de ETH
 * @param {number} props.chainId - ID de la red
 * @param {boolean} props.hasResults - Si hay resultados para mostrar
 */
export const SidePanel = ({ 
  isConnected, 
  ethBalance, 
  chainId, 
  hasResults 
}) => {
  const renderContent = () => {
    if (!isConnected) {
      return <NotConnectedPlaceholder />;
    }
    
    if (hasResults) {
      return <AnalysisComplete />;
    }
    
    return <BalanceInfo ethBalance={ethBalance} chainId={chainId} />;
  };

  return (
    <div style={panelStyles.rightPanel}>
      {renderContent()}
    </div>
  );
};

export default SidePanel;
