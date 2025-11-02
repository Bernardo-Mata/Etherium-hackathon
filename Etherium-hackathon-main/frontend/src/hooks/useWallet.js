/**
 * @fileoverview Custom hook para manejar la conexión y estado de la wallet
 * @module hooks/useWallet
 */

import { useState, useEffect, useCallback } from 'react';
import walletService from '../services/wallet.service';
import { DEFAULT_CHAIN_ID } from '../config/blockchain.config';
import { STATUS_MESSAGES, DISPLAY_CONFIG } from '../constants/app.constants';

/**
 * Hook personalizado para manejar el estado y operaciones de la wallet
 * @returns {Object} Estado y funciones de la wallet
 */
export const useWallet = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [ethBalance, setEthBalance] = useState('0.0000');
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Actualiza el balance de la wallet
   * @param {string} address - Dirección de la wallet
   */
  const updateBalance = useCallback(async (address) => {
    try {
      const balance = await walletService.getBalance(address);
      setEthBalance(balance);
      return balance;
    } catch (err) {
      console.error('Error actualizando balance:', err);
      setError(err.message);
      return '0.0000';
    }
  }, []);

  /**
   * Maneja el cambio de cuentas
   * @param {Array<string>} accounts - Array de cuentas
   */
  const handleAccountsChanged = useCallback(async (accounts) => {
    if (accounts.length === 0) {
      // Usuario desconectó todas las cuentas
      setWalletAddress('');
      setEthBalance('0.0000');
      setChainId(null);
    } else {
      const newAddress = accounts[0];
      setWalletAddress(newAddress);
      await updateBalance(newAddress);
    }
  }, [updateBalance]);

  /**
   * Maneja el cambio de red
   * @param {string} newChainId - Nuevo chainId en formato hex
   */
  const handleChainChanged = useCallback((newChainId) => {
    const chainIdNumber = parseInt(newChainId, 16);
    setChainId(chainIdNumber);
    // Recargar para asegurar estado consistente
    window.location.reload();
  }, []);

  /**
   * Conecta la wallet
   */
  const connect = useCallback(async () => {
    if (!walletService.isMetaMaskInstalled()) {
      setError(STATUS_MESSAGES.WALLET_NOT_INSTALLED);
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const address = await walletService.connect();
      setWalletAddress(address);

      const balance = await updateBalance(address);
      
      const network = await walletService.getNetwork();
      setChainId(network.chainId);

      // Suscribirse a eventos
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return { address, balance, chainId: network.chainId };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, [updateBalance, handleAccountsChanged, handleChainChanged]);

  /**
   * Desconecta la wallet
   */
  const disconnect = useCallback(() => {
    setWalletAddress('');
    setEthBalance('0.0000');
    setChainId(null);
    setError(null);

    // Remover listeners
    if (window.ethereum && window.ethereum.removeListener) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    }
  }, [handleAccountsChanged, handleChainChanged]);

  /**
   * Firma un mensaje
   * @param {string} message - Mensaje a firmar
   * @returns {Promise<string>} Firma del mensaje
   */
  const signMessage = useCallback(async (message) => {
    if (!walletAddress) {
      throw new Error('Wallet no conectada');
    }

    try {
      return await walletService.personalSign(message, walletAddress);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [walletAddress]);

  /**
   * Cambia la red
   * @param {number} targetChainId - ID de la red objetivo
   */
  const switchNetwork = useCallback(async (targetChainId) => {
    try {
      await walletService.switchNetwork(targetChainId);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  /**
   * Verifica si hay una conexión existente al montar el componente
   */
  useEffect(() => {
    const checkExistingConnection = async () => {
      const accounts = await walletService.getAccounts();
      
      if (accounts.length > 0) {
        const address = accounts[0];
        setWalletAddress(address);
        
        await updateBalance(address);
        
        const network = await walletService.getNetwork();
        setChainId(network.chainId);

        // Suscribirse a eventos
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
      }
    };

    if (walletService.isMetaMaskInstalled()) {
      checkExistingConnection();
    }

    // Cleanup
    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [updateBalance, handleAccountsChanged, handleChainChanged]);

  return {
    walletAddress,
    ethBalance,
    chainId,
    isConnecting,
    error,
    isConnected: !!walletAddress,
    isCorrectNetwork: chainId === DEFAULT_CHAIN_ID,
    connect,
    disconnect,
    signMessage,
    switchNetwork,
    updateBalance,
  };
};

export default useWallet;
