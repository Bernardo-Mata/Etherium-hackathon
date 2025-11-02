/**
 * @fileoverview Componente principal de la aplicación Anti-MEV Dark Pool
 * @module components/AntiMevApp
 */

import React, { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { useOrderForm } from '../hooks/useOrderForm';
import { Header } from './Header';
import { OrderFormFields } from './OrderFormFields';
import { ResultsPanel } from './ResultsPanel';
import { SidePanel } from './SidePanel';
import { StatusMessage } from './StatusMessage';
import { layoutStyles, panelStyles } from '../styles/componentStyles';
import { DEFAULT_CHAIN_ID } from '../config/blockchain.config';
import { ETH_PRICE_USD, MEV_SLIPPAGE_RATE, STATUS_MESSAGES } from '../constants/app.constants';
import { encryptOrder, DEFAULT_SHIFT } from '../utils/caesarCipher';

/**
 * Componente principal de la aplicación
 */
export const AntiMevApp = () => {
  // Estados de wallet usando custom hook
  const {
    walletAddress,
    ethBalance,
    chainId,
    isConnecting,
    connect,
    disconnect,
    signMessage,
  } = useWallet();

  // Estados del formulario usando custom hook
  const {
    order,
    errors,
    handleInputChange,
    validateForm,
    resetForm,
  } = useOrderForm();

  // Estados adicionales
  const [demoMode, setDemoMode] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [results, setResults] = useState(null);
  const [signedData, setSignedData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Maneja la conexión de la wallet
   */
  const handleConnect = async () => {
    try {
      setStatusMessage(STATUS_MESSAGES.CONNECTING_WALLET);
      const data = await connect();
      setStatusMessage(
        `${STATUS_MESSAGES.WALLET_CONNECTED} | Saldo: ${data.balance} ETH | Red: ${data.chainId}`
      );
    } catch (error) {
      setStatusMessage(error.message);
    }
  };

  /**
   * Maneja la desconexión de la wallet
   */
  const handleDisconnect = () => {
    disconnect();
    setResults(null);
    setSignedData(null);
    setStatusMessage(STATUS_MESSAGES.WALLET_DISCONNECTED);
  };

  /**
   * Maneja la creación de una nueva orden
   */
  const handleNewOrder = () => {
    setResults(null);
    setSignedData(null);
    resetForm();
    setStatusMessage('');
  };

  /**
   * Simula los resultados de la ejecución TWAP
   * @param {Object} orderData - Datos de la orden
   * @returns {Object} Resultados simulados
   */
  const simulateOrderExecution = (orderData) => {
    const orderValue = parseFloat(orderData.amount) * ETH_PRICE_USD;
    
    return {
      darkPoolOutput: orderValue,
      normalSwapOutput: orderValue * (1 - MEV_SLIPPAGE_RATE),
      totalSavings: orderValue * MEV_SLIPPAGE_RATE,
      encryptionUsed: demoMode 
        ? "🎮 Cifrado César (MODO DEMO)" 
        : "Cifrado César (ROT13) Simulado"
    };
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!walletAddress) {
      setStatusMessage("Por favor, conecta tu billetera");
      return;
    }

    // Validar formulario
    if (!validateForm()) {
      setStatusMessage("Por favor, corrige los errores en el formulario");
      return;
    }

    // Validar saldo si no está en modo demo
    if (!demoMode && parseFloat(order.amount) > parseFloat(ethBalance)) {
      setStatusMessage(
        `❌ ${STATUS_MESSAGES.INSUFFICIENT_BALANCE}. Necesitas ${order.amount} ETH, tienes ${ethBalance} ETH. Activa el Modo Demo para probar.`
      );
      return;
    }
    
    // Validar red
    if (chainId !== null && chainId !== DEFAULT_CHAIN_ID) {
      setStatusMessage(
        `❌ Por favor, cambia a Ethereum Mainnet (Chain ID: ${DEFAULT_CHAIN_ID}) para continuar.`
      );
      return;
    }

    setIsSubmitting(true);

    try {
      setStatusMessage(STATUS_MESSAGES.REQUESTING_SIGNATURE);

      // Crear mensaje para firmar
      const message = JSON.stringify({
        amount: order.amount.toString(),
        tokenIn: order.tokenIn,
        tokenOut: order.tokenOut,
        duration: order.duration.toString(),
        timestamp: Date.now().toString()
      });

      // Encriptar la orden
      const encryptedOrder = encryptOrder(JSON.parse(message), DEFAULT_SHIFT);

      // Firmar el mensaje
      const signature = await signMessage(message);

      setSignedData({ walletAddress, message, signature });
      
      setStatusMessage(
        demoMode 
          ? "2. ✅ Firma DEMO generada. Simulando..." 
          : STATUS_MESSAGES.SIGNATURE_GENERATED
      );

      // Simular la ejecución (en producción, esto iría al backend)
      const simulatedResults = simulateOrderExecution(order);

      setTimeout(() => {
        setResults(simulatedResults);
        setStatusMessage(
          demoMode 
            ? "✅ Orden DEMO procesada. (No se envió ETH real)" 
            : STATUS_MESSAGES.ORDER_PROCESSING
        );
      }, 1500);

    } catch (error) {
      console.error("Error en el proceso de firma:", error);
      const msg = error.message.includes('rechazada') || error.message.includes('rejected')
        ? STATUS_MESSAGES.SIGNATURE_REJECTED
        : `❌ Fallo: ${error.message}`;
      setStatusMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Renderiza el contenido principal
   */
  const renderMainContent = () => {
    // Si no está conectado, mostrar mensaje
    if (!walletAddress) {
      return (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center', 
          textAlign: 'center', 
          padding: '60px 30px' 
        }}>
          <span style={{ fontSize: '3em', color: '#dc3545' }}>⛔</span>
          <h3 style={{ color: '#dc3545', marginTop: '15px' }}>CONEXIÓN REQUERIDA</h3>
          <p style={{ color: '#999' }}>
            Conecta tu billetera **MetaMask** para ver tu saldo real de ETH.
          </p>
          <button 
            onClick={handleConnect} 
            style={{ 
              padding: '15px 30px',
              marginTop: '20px',
              backgroundColor: '#dc3545',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Conectar Billetera
          </button>
        </div>
      );
    }

    // Si hay resultados, mostrar panel de resultados
    if (results) {
      return (
        <ResultsPanel 
          results={results} 
          order={order} 
          signedData={signedData} 
          onNewOrder={handleNewOrder} 
        />
      );
    }

    // Mostrar formulario
    return (
      <OrderFormFields
        order={order}
        ethBalance={ethBalance}
        demoMode={demoMode}
        chainId={chainId}
        targetChainId={DEFAULT_CHAIN_ID}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        onDemoModeToggle={(e) => setDemoMode(e.target.checked)}
        isSubmitting={isSubmitting}
        errors={errors}
      />
    );
  };

  return (
    <div style={layoutStyles.mainLayout}>
      <Header 
        walletAddress={walletAddress}
        isConnecting={isConnecting}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        activeLink="TWAP"
      />

      <div style={layoutStyles.contentArea}>
        <div style={panelStyles.leftPanel}>
          {renderMainContent()}
        </div>
        
        <SidePanel 
          isConnected={!!walletAddress}
          ethBalance={ethBalance}
          chainId={chainId}
          hasResults={!!results}
        />
      </div>
      
      <StatusMessage message={statusMessage} />
    </div>
  );
};

export default AntiMevApp;
