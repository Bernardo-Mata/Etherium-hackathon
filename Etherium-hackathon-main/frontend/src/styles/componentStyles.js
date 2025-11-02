/**
 * @fileoverview Estilos centralizados para componentes de la aplicación
 * @module styles/componentStyles
 */

/**
 * Estilos para el diseño principal y layout
 */
export const layoutStyles = {
  mainLayout: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0a',
    color: '#f0f0f0',
    fontFamily: "'Inter', sans-serif",
  },
  contentArea: {
    display: 'flex',
    maxWidth: '1200px',
    margin: '40px auto',
    gap: '30px',
    flexWrap: 'wrap',
  },
};

/**
 * Estilos para el header y navegación
 */
export const headerStyles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    borderBottom: '1px solid #1a1a1a',
    backgroundColor: '#111111',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#00ccff',
  },
  navLinks: {
    display: 'flex',
    gap: '20px',
  },
  navLink: {
    color: '#999',
    cursor: 'pointer',
    transition: 'color 0.2s, border-bottom 0.2s',
    paddingBottom: '5px',
  },
  navLinkActive: {
    color: '#fff',
    fontWeight: 'bold',
    borderBottom: '2px solid #00ccff',
  },
  navLinkHover: {
    color: '#fff',
    fontWeight: 'bold',
    borderBottom: '2px solid #00ccff',
  },
};

/**
 * Estilos para componentes de wallet
 */
export const walletStyles = {
  connectWalletButton: {
    padding: '10px 20px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#00ccff',
    color: '#000',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  connectedWalletInfo: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: '10px',
    padding: '8px 15px',
    border: '1px solid #00ccff',
  },
  walletAddress: {
    fontSize: '14px',
    marginRight: '10px',
  },
  disconnectWalletButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#00ccff',
    cursor: 'pointer',
    marginLeft: '5px',
  },
};

/**
 * Estilos para paneles y cards
 */
export const panelStyles = {
  leftPanel: {
    flex: 2,
    minWidth: '400px',
    backgroundColor: '#1e1e1e',
    borderRadius: '15px',
    boxShadow: '0 0 20px rgba(0, 204, 255, 0.1)',
    padding: '30px',
  },
  rightPanel: {
    flex: 1,
    minWidth: '300px',
    backgroundColor: '#1e1e1e',
    borderRadius: '15px',
    padding: '30px',
  },
  resultCard: {
    flex: 1,
    minWidth: '250px',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
  },
  idealCard: {
    backgroundColor: '#005f77',
    border: '1px solid #00ccff',
  },
  normalCard: {
    backgroundColor: '#331a1a',
    border: '1px solid #993333',
  },
};

/**
 * Estilos para formularios e inputs
 */
export const formStyles = {
  inputGroup: {
    marginBottom: '20px',
    position: 'relative',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#00ccff',
    fontWeight: '600',
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    borderRadius: '8px',
    border: '1px solid #333',
    backgroundColor: '#2a2a2a',
    color: '#fff',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  balanceDisplay: {
    backgroundColor: '#00ccff1a',
    border: '1px solid #00ccff',
    fontWeight: 'bold',
  },
  tokenLabel: {
    position: 'absolute',
    right: '15px',
    top: '40px',
    padding: '5px 10px',
    backgroundColor: '#333',
    borderRadius: '6px',
    color: '#00ccff',
    fontWeight: 'bold',
    fontSize: '12px',
  },
  submitOrderButton: {
    width: '100%',
    padding: '15px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#00ccff',
    color: '#000',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
    marginTop: '15px',
  },
};

/**
 * Estilos para textos y tipografía
 */
export const textStyles = {
  sectionTitle: {
    fontSize: '24px',
    color: '#fff',
    marginBottom: '10px',
  },
  sectionSubtitle: {
    color: '#999',
    marginBottom: '20px',
    fontSize: '14px',
  },
  value: {
    fontSize: '20px',
    fontWeight: 'bold',
    margin: '10px 0',
    color: '#fff',
  },
  detail: {
    fontSize: '12px',
    color: '#ccc',
  },
};

/**
 * Estilos para componentes especiales
 */
export const specialStyles = {
  savingsHighlight: {
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#00ff7f1a',
    border: '2px solid #00ff7f',
    borderRadius: '10px',
    margin: '25px 0',
  },
  savingsValue: {
    fontSize: '28px',
    fontWeight: '900',
    color: '#00ff7f',
    margin: '10px 0',
  },
  globalStatusMessage: {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#00ccff',
    color: '#000',
    padding: '10px 20px',
    borderRadius: '10px',
    fontWeight: 'bold',
    zIndex: 1000,
  },
  chartContainer: {
    padding: '20px',
    backgroundColor: '#2a2a2a',
    borderRadius: '10px',
    marginTop: '25px',
    height: '300px',
  },
  comparisonGrid: {
    display: 'flex',
    gap: '20px',
    margin: '25px 0',
    flexWrap: 'wrap',
  },
  connectWalletPlaceholder: {
    padding: '40px 20px',
    textAlign: 'center',
    border: '1px dashed #333',
    borderRadius: '10px',
    marginTop: '20px',
  },
};

/**
 * Combina todos los estilos en un objeto exportable
 */
export const styles = {
  ...layoutStyles,
  ...headerStyles,
  ...walletStyles,
  ...panelStyles,
  ...formStyles,
  ...textStyles,
  ...specialStyles,
};

export default styles;
