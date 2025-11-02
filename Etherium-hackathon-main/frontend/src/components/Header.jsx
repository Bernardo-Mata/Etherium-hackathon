/**
 * @fileoverview Componente Header con navegación y botón de wallet
 * @module components/Header
 */

import React, { useState } from 'react';
import { headerStyles, walletStyles } from '../styles/componentStyles';
import { formatAddress } from '../utils/format.utils';

/**
 * Componente de navegación
 * @param {Object} props - Props del componente
 * @param {string} props.activeLink - Link activo
 * @param {Function} props.onLinkClick - Callback al hacer click en un link
 */
const Navigation = ({ activeLink, onLinkClick }) => {
  const [hoveredLink, setHoveredLink] = useState(null);
  const links = ['Swap', 'Limit', 'TWAP', 'Learn'];

  const getLinkStyle = (name) => {
    const isActive = name === activeLink;
    const isHovered = hoveredLink === name;
    
    if (isActive) return headerStyles.navLinkActive;
    if (isHovered) return { ...headerStyles.navLink, ...headerStyles.navLinkHover };
    return headerStyles.navLink;
  };

  return (
    <div style={headerStyles.navLinks}>
      {links.map(name => (
        <span 
          key={name}
          style={getLinkStyle(name)}
          onMouseEnter={() => setHoveredLink(name)}
          onMouseLeave={() => setHoveredLink(null)}
          onClick={() => onLinkClick && onLinkClick(name)}
        >
          {name}
        </span>
      ))}
    </div>
  );
};

/**
 * Componente de botón de wallet
 * @param {Object} props - Props del componente
 * @param {string} props.walletAddress - Dirección de la wallet conectada
 * @param {boolean} props.isConnecting - Si está en proceso de conexión
 * @param {Function} props.onConnect - Callback al conectar
 * @param {Function} props.onDisconnect - Callback al desconectar
 */
const WalletButton = ({ walletAddress, isConnecting, onConnect, onDisconnect }) => {
  if (!walletAddress) {
    return (
      <button 
        onClick={onConnect} 
        style={walletStyles.connectWalletButton}
        disabled={isConnecting}
      >
        {isConnecting ? 'Conectando...' : 'Conectar Billetera'}
      </button>
    );
  }

  return (
    <div style={walletStyles.connectedWalletInfo}>
      <span style={walletStyles.walletAddress}>
        {formatAddress(walletAddress)}
      </span>
      <button 
        onClick={onDisconnect} 
        style={walletStyles.disconnectWalletButton}
        title="Desconectar wallet"
      >
        ✖️
      </button>
    </div>
  );
};

/**
 * Componente Header principal
 * @param {Object} props - Props del componente
 * @param {string} props.walletAddress - Dirección de la wallet
 * @param {boolean} props.isConnecting - Estado de conexión
 * @param {Function} props.onConnect - Función para conectar
 * @param {Function} props.onDisconnect - Función para desconectar
 * @param {string} [props.activeLink='TWAP'] - Link activo en la navegación
 * @param {Function} [props.onNavigate] - Callback de navegación
 */
export const Header = ({ 
  walletAddress, 
  isConnecting, 
  onConnect, 
  onDisconnect,
  activeLink = 'TWAP',
  onNavigate 
}) => {
  return (
    <div style={headerStyles.header}>
      <div style={headerStyles.logo}>
        Anti-MEV Dark Pool
      </div>
      <Navigation activeLink={activeLink} onLinkClick={onNavigate} />
      <WalletButton 
        walletAddress={walletAddress}
        isConnecting={isConnecting}
        onConnect={onConnect}
        onDisconnect={onDisconnect}
      />
    </div>
  );
};

export default Header;
