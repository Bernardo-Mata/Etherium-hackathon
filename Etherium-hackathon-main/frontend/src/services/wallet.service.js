/**
 * @fileoverview Servicio para interactuar con la blockchain y wallets
 * @module services/wallet
 */

import { ethers } from 'ethers';
import { DEFAULT_CHAIN_ID, getNetworkConfig } from '../config/blockchain.config';

/**
 * Clase para manejar operaciones de wallet y blockchain
 */
class WalletService {
  constructor() {
    this.provider = null;
    this.signer = null;
  }

  /**
   * Verifica si MetaMask está instalado
   * @returns {boolean} true si MetaMask está disponible
   */
  isMetaMaskInstalled() {
    return typeof window.ethereum !== 'undefined';
  }

  /**
   * Obtiene el provider de ethers.js
   * @returns {Promise<ethers.BrowserProvider>} Provider de ethers
   * @throws {Error} Si MetaMask no está instalado
   */
  async getProvider() {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask no está instalado');
    }

    if (!this.provider) {
      this.provider = new ethers.BrowserProvider(window.ethereum);
    }

    return this.provider;
  }

  /**
   * Obtiene el signer (firmante) actual
   * @returns {Promise<ethers.Signer>} Signer de ethers
   * @throws {Error} Si no hay conexión
   */
  async getSigner() {
    const provider = await this.getProvider();
    this.signer = await provider.getSigner();
    return this.signer;
  }

  /**
   * Solicita conexión a MetaMask
   * @returns {Promise<string>} Dirección de la wallet conectada
   * @throws {Error} Si la conexión falla
   */
  async connect() {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      return accounts[0];
    } catch (error) {
      if (error.code === 4001) {
        throw new Error('Conexión rechazada por el usuario');
      }
      throw error;
    }
  }

  /**
   * Obtiene el balance de ETH de una dirección
   * @param {string} address - Dirección de la wallet
   * @returns {Promise<string>} Balance formateado en ETH
   * @throws {Error} Si falla la lectura del balance
   */
  async getBalance(address) {
    try {
      const provider = await this.getProvider();
      const balanceWei = await provider.getBalance(address);
      const balanceEth = ethers.formatEther(balanceWei);
      return parseFloat(balanceEth).toFixed(4);
    } catch (error) {
      console.error('Error obteniendo balance:', error);
      throw new Error('No se pudo obtener el balance');
    }
  }

  /**
   * Obtiene la red actual
   * @returns {Promise<Object>} Información de la red
   */
  async getNetwork() {
    const provider = await this.getProvider();
    const network = await provider.getNetwork();
    return {
      chainId: Number(network.chainId),
      name: network.name,
      config: getNetworkConfig(Number(network.chainId))
    };
  }

  /**
   * Firma un mensaje con la wallet del usuario
   * @param {string} message - Mensaje a firmar
   * @returns {Promise<string>} Firma del mensaje
   * @throws {Error} Si la firma falla o es rechazada
   */
  async signMessage(message) {
    try {
      const signer = await this.getSigner();
      const signature = await signer.signMessage(message);
      return signature;
    } catch (error) {
      if (error.code === 'ACTION_REJECTED') {
        throw new Error('Firma rechazada por el usuario');
      }
      throw error;
    }
  }

  /**
   * Firma un mensaje usando personal_sign (EIP-191)
   * @param {string} message - Mensaje a firmar
   * @param {string} address - Dirección de la wallet
   * @returns {Promise<string>} Firma del mensaje
   */
  async personalSign(message, address) {
    try {
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, address]
      });
      return signature;
    } catch (error) {
      if (error.code === 4001) {
        throw new Error('Firma rechazada por el usuario');
      }
      throw error;
    }
  }

  /**
   * Solicita cambio de red
   * @param {number} chainId - ID de la red deseada
   * @returns {Promise<void>}
   */
  async switchNetwork(chainId) {
    const hexChainId = `0x${chainId.toString(16)}`;
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexChainId }],
      });
    } catch (switchError) {
      // Si la red no está agregada, intentar agregarla
      if (switchError.code === 4902) {
        const networkConfig = getNetworkConfig(chainId);
        if (networkConfig) {
          await this.addNetwork(networkConfig);
        }
      } else {
        throw switchError;
      }
    }
  }

  /**
   * Agrega una nueva red a MetaMask
   * @param {Object} networkConfig - Configuración de la red
   * @returns {Promise<void>}
   */
  async addNetwork(networkConfig) {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: `0x${networkConfig.chainId.toString(16)}`,
        chainName: networkConfig.name,
        rpcUrls: [networkConfig.rpcUrl],
        blockExplorerUrls: [networkConfig.explorerUrl],
      }],
    });
  }

  /**
   * Obtiene las cuentas conectadas sin solicitar permiso
   * @returns {Promise<Array<string>>} Array de direcciones conectadas
   */
  async getAccounts() {
    if (!this.isMetaMaskInstalled()) {
      return [];
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_accounts'
      });
      return accounts;
    } catch (error) {
      console.error('Error obteniendo cuentas:', error);
      return [];
    }
  }
}

// Exportar instancia singleton
export default new WalletService();
