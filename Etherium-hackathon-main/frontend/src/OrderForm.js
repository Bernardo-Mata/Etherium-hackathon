import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// 🆕 IMPORTAR ETHERS.JS CORRECTAMENTE
import { ethers } from 'ethers';

// --- CONSTANTES GLOBALES ---
const CHAIN_ID = 1; // Ethereum Mainnet

// --- Estilos Centralizados ---
const styles = {
    mainLayout: {
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        color: '#f0f0f0',
        fontFamily: "'Inter', sans-serif",
    },
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
    navLinkHover: { // Nuevo estilo para hover
        color: '#fff',
        fontWeight: 'bold',
        borderBottom: '2px solid #00ccff',
    },
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
    contentArea: {
        display: 'flex',
        maxWidth: '1200px',
        margin: '40px auto',
        gap: '30px',
        flexWrap: 'wrap',
    },
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
    resultsContainer: {
        padding: '30px 0',
    },
    comparisonGrid: {
        display: 'flex',
        gap: '20px',
        margin: '25px 0',
        flexWrap: 'wrap',
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
    connectWalletPlaceholder: {
        padding: '40px 20px',
        textAlign: 'center',
        border: '1px dashed #333',
        borderRadius: '10px',
        marginTop: '20px',
    },
    chartContainer: {
        padding: '20px',
        backgroundColor: '#2a2a2a',
        borderRadius: '10px',
        marginTop: '25px',
        height: '300px',
    },
};

// --- Componente de Resultados ---
const ResultsPanel = ({ results, order, onNewOrder, signedData }) => {
    const [showReceipt, setShowReceipt] = useState(false);
    
    if (!results || !signedData) return null;
    
    const formatCurrency = (value) => parseFloat(value).toLocaleString('es-ES', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    });

    // Generar datos para Recharts (Monto por porción)
    const twapData = Array.from({ length: Math.min(order.duration, 24) }, (_, i) => ({
        name: `${i + 1}h`,
        amount: order.amount / order.duration,
    }));

    return (
        <div style={styles.resultsContainer}>
            <h2 style={styles.sectionTitle}>✨ ¡Orden Privada Ejecutada con Éxito!</h2>
            <p style={styles.sectionSubtitle}>
                Orden para **{signedData.walletAddress.substring(0, 8)}...** ejecutada de forma privada.
            </p>
            
            <div style={styles.comparisonGrid}>
                <div style={{ ...styles.resultCard, ...styles.idealCard }}>
                    <h3>🚀 Dark Pool (Anti-MEV)</h3>
                    <p style={styles.value}>**{formatCurrency(results.darkPoolOutput)} USDC**</p>
                    <p style={styles.detail}>Precio ideal sin deslizamiento</p>
                </div>
                
                <div style={{ ...styles.resultCard, ...styles.normalCard }}>
                    <h3>❌ Swap Estándar</h3>
                    <p style={styles.value}>**{formatCurrency(results.normalSwapOutput)} USDC**</p>
                    <p style={styles.detail}>Con 3% de pérdida por MEV</p>
                </div>
            </div>

            <div style={styles.savingsHighlight}>
                <h3>💰 ¡Ahorro Total Preservado!</h3>
                <p style={styles.savingsValue}>
                    {formatCurrency(results.totalSavings)} USDC
                </p>
                <p>Valor preservado usando ejecución privada</p>
            </div>

            {/* Gráfico de Recharts */}
            <div style={styles.chartContainer}>
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

            {/* Información de Encriptación */}
            {results.encryptionUsed && (
                <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #00ff7f', borderRadius: '8px', backgroundColor: '#00ff7f1a' }}>
                    <h4 style={{ color: '#00ff7f', marginTop: '0' }}>🔒 Orden Encriptada</h4>
                    <p style={{ margin: '5px 0' }}><strong>Método:</strong> {results.encryptionUsed}</p>
                    <p style={{ margin: '5px 0', fontSize: '0.9em', color: '#666' }}>
                        Los datos de la orden fueron encriptados usando cifrado César (ROT13) antes de ser procesados en la simulación.
                        Esto ayuda a proteger la información sensible durante la transmisión.
                    </p>
                </div>
            )}
            
            {/* Recibo Criptográfico */}
            <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #00ccff', borderRadius: '8px', backgroundColor: '#00ccff1a' }}>
                <button 
                    onClick={() => setShowReceipt(!showReceipt)} 
                    style={{ background: 'none', border: 'none', color: '#00ccff', cursor: 'pointer', fontWeight: 'bold' }}>
                    {showReceipt ? 'Ocultar' : 'Ver'} Recibo Criptográfico
                </button>
                
                {showReceipt && signedData && (
                    <div style={{ marginTop: '10px', fontSize: '0.9em' }}>
                        <h4 style={{ color: '#fff' }}>Detalles de la Firma:</h4>
                        <p style={{ margin: '5px 0', wordBreak: 'break-all' }}>
                            <strong>Dirección:</strong> <code style={{ color: '#00ff7f' }}>{signedData.walletAddress}</code>
                        </p>
                        <p style={{ margin: '5px 0', wordBreak: 'break-all' }}>
                            <strong>Firma:</strong> <code style={{ color: '#ccc' }}>{signedData.signature.substring(0, 60)}...</code>
                        </p>
                    </div>
                )}
            </div>
            {/* --- FIN RECIBO CRIPTOGRÁFICO --- */}

            <button onClick={onNewOrder} className="reset-button">
                Cargar Nueva Orden
            </button>
        </div>
    );
};

function OrderForm() {
    const [walletAddress, setWalletAddress] = useState('');
    const [ethBalance, setEthBalance] = useState('0.0000');
    const [chainId, setChainId] = useState(null);
    const [hoveredLink, setHoveredLink] = useState(null);
    const [demoMode, setDemoMode] = useState(false);
    
    const [order, setOrder] = useState({ 
        amount: 0.0001,
        tokenIn: 'ETH',
        tokenOut: 'USDC', 
        duration: 48 
    });
    
    const [statusMessage, setStatusMessage] = useState('');
    const [results, setResults] = useState(null);
    const [signedData, setSignedData] = useState(null);

    // 🔧 ACTUALIZAR SALDO - ETHERS.JS V6
    const updateBalance = async (address) => {
        try {
            console.log('🔍 Intentando leer saldo para:', address);
            
            // Crear provider (solo v6)
            const provider = new ethers.BrowserProvider(window.ethereum);
            
            // Obtener saldo en Wei
            const balanceWei = await provider.getBalance(address);
            console.log('📊 Balance en Wei:', balanceWei.toString());
            
            // Convertir de Wei a ETH (v6)
            const balanceEth = ethers.formatEther(balanceWei);
            console.log('💰 Balance en ETH:', balanceEth);
            
            // Formatear a 4 decimales
            const balanceFormatted = parseFloat(balanceEth).toFixed(4);
            
            console.log(`✅ Saldo leído correctamente: ${balanceFormatted} ETH`);
            setEthBalance(balanceFormatted);
            return balanceFormatted;
            
        } catch (error) {
            console.error('❌ Error leyendo saldo:', error);
            setStatusMessage(`⚠️ Error al leer saldo: ${error.message}`);
            return '0.0000';
        }
    };

    // Conectar a MetaMask
    const connectWallet = async () => {
        if (typeof window.ethereum === 'undefined') {
            setStatusMessage('❌ MetaMask no está instalado. Por favor instálalo desde metamask.io');
            return;
        }

        try {
            console.log('🔌 Intentando conectar a MetaMask...');
            setStatusMessage('🔄 Conectando a MetaMask...');
            
            // Solicitar acceso a las cuentas
            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });
            
            console.log('✅ Cuentas obtenidas:', accounts);
            
            const address = accounts[0];
            setWalletAddress(address);

            // Crear provider (v6)
            const provider = new ethers.BrowserProvider(window.ethereum);

            // Obtener la red actual
            const network = await provider.getNetwork();
            const currentChainId = Number(network.chainId);
            console.log('🌐 Red detectada - Chain ID:', currentChainId);
            setChainId(currentChainId);

            // 🔧 Leer saldo REAL
            console.log('💰 Leyendo saldo...');
            const realBalance = await updateBalance(address);

            setStatusMessage(`✅ Conectado | Saldo: ${realBalance} ETH | Red: ${currentChainId}`);

            // Escuchar cambios
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);

        } catch (error) {
            console.error('❌ Error conectando:', error);
            const msg = error.code === 4001 
                ? "Conexión rechazada por el usuario." 
                : `Error: ${error.message}`;
            setStatusMessage(`❌ ${msg}`);
        }
    };

    // Manejar cambio de cuentas
    const handleAccountsChanged = async (accounts) => {
        if (accounts.length === 0) {
            disconnectWallet();
        } else {
            const newAddress = accounts[0];
            setWalletAddress(newAddress);
            const newBalance = await updateBalance(newAddress);
            setStatusMessage(`✅ Nueva cuenta conectada. Saldo: ${newBalance} ETH`);
        }
    };

    // Manejar cambio de red
    const handleChainChanged = (newChainId) => {
        setChainId(parseInt(newChainId, 16));
        setStatusMessage("⚠️ Red cambiada. Recargando para verificar conexión...");
        setTimeout(() => window.location.reload(), 1000);
    };

    // Desconectar wallet
    const disconnectWallet = () => {
        setWalletAddress('');
        setEthBalance('0.0000');
        setChainId(null);
        setResults(null);
        setSignedData(null);
        setStatusMessage('Billetera desconectada');
        
        // Remover listeners
        if (window.ethereum && window.ethereum.removeListener) {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
    };

    // Verificar conexión al cargar
    useEffect(() => {
        const checkConnection = async () => {
            if (typeof window.ethereum !== 'undefined') {
                try {
                    console.log('🔍 Verificando si ya hay una conexión...');
                    const accounts = await window.ethereum.request({ 
                        method: 'eth_accounts' 
                    });
                    
                    if (accounts.length > 0) {
                        console.log('✅ Wallet ya conectada:', accounts[0]);
                        const address = accounts[0];
                        setWalletAddress(address);
                        
                        // Crear provider (v6)
                        const provider = new ethers.BrowserProvider(window.ethereum);
                        
                        const balance = await updateBalance(address);
                        
                        const network = await provider.getNetwork();
                        const currentChainId = Number(network.chainId);
                        setChainId(currentChainId);
                        
                        setStatusMessage(`✅ Reconectado | Saldo: ${balance} ETH`);
                    } else {
                        console.log('ℹ️ No hay wallet conectada previamente');
                    }
                } catch (error) {
                    console.error('❌ Error verificando conexión:', error);
                }
            } else {
                console.warn('⚠️ MetaMask no está instalado');
            }
        };
        
        checkConnection();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Solo para el monto, permitimos decimales
        const newValue = name === 'amount' ? value : value;
        setOrder({ ...order, [name]: newValue });
    };

    const handleNewOrder = () => {
        setResults(null);
        setSignedData(null);
        setStatusMessage('');
    };

    // Manejador del Formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!walletAddress) {
            setStatusMessage("Por favor, conecta tu billetera");
            return;
        }

        // 🆕 Validación modificada: permite orden si está en modo demo
        if (!demoMode && parseFloat(order.amount) > parseFloat(ethBalance)) {
            setStatusMessage(`❌ Saldo insuficiente. Necesitas ${order.amount} ETH, tienes ${ethBalance} ETH. Activa el Modo Demo para probar.`);
            return;
        }
        
        if (chainId !== null && chainId !== CHAIN_ID) {
            setStatusMessage(`❌ Por favor, cambia a Ethereum Mainnet (Chain ID: ${CHAIN_ID}) para continuar.`);
            return;
        }

        try {
            setStatusMessage("1. Solicitando firma...");

            // Paso 1: Generar el mensaje JSON y firmarlo
            const message = JSON.stringify({
                amount: order.amount.toString(),
                tokenIn: order.tokenIn,
                tokenOut: order.tokenOut,
                duration: order.duration.toString(),
                timestamp: Date.now().toString()
            });

            // Usar personal_sign para firmar (estándar EIP-191)
            const signature = await window.ethereum.request({
                method: 'personal_sign',
                params: [message, walletAddress]
            });

            setSignedData({ walletAddress, message, signature });
            setStatusMessage(demoMode ? "2. ✅ Firma DEMO generada. Simulando..." : "2. Firma generada. Simulando resultados...");

            // Paso 2: Simular el proceso de backend y los resultados
            const ethPrice = 3000; // Precio simulado de ETH/USDC para el cálculo
            const orderValue = parseFloat(order.amount) * ethPrice;
            
            const simulatedResults = {
                darkPoolOutput: orderValue,
                normalSwapOutput: orderValue * 0.97, // 3% de pérdida simulada por MEV
                totalSavings: orderValue * 0.03,
                encryptionUsed: demoMode ? "🎮 Cifrado César (MODO DEMO)" : "Cifrado César (ROT13) Simulado"
            };

            // Simular retraso del backend
            setTimeout(() => {
                setResults(simulatedResults);
                setStatusMessage(demoMode ? "✅ Orden DEMO procesada. (No se envió ETH real)" : "✅ Orden procesada exitosamente. Vea su ahorro.");
            }, 1500);

        } catch (error) {
            console.error("Error en el proceso de firma:", error);
            const msg = error.code === 4001 ? "Firma rechazada por el usuario." : `Fallo: ${error.message}`;
            setStatusMessage(`❌ ${msg}`);
        }
    };

    const getLinkStyle = (name) => {
        const isActive = name === 'TWAP';
        const isHovered = hoveredLink === name;
        
        if (isActive) return styles.navLinkActive;
        if (isHovered) return { ...styles.navLink, ...styles.navLinkHover };
        return styles.navLink;
    };

    const renderMainContent = () => {
        // Bloqueo si no está conectado
        if (!walletAddress) {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '60px 30px' }}>
                    <span style={{ fontSize: '3em', color: '#dc3545' }}>⛔</span>
                    <h3 style={{ color: '#dc3545', marginTop: '15px' }}>CONEXIÓN REQUERIDA</h3>
                    <p style={{ color: '#999' }}>
                        Conecta tu billetera **MetaMask** para ver tu saldo real de ETH.
                    </p>
                    <button onClick={connectWallet} style={{ ...styles.connectWalletButton, marginTop: '20px', backgroundColor: '#dc3545' }}>
                        Conectar Billetera
                    </button>
                </div>
            );
        }

        // Si hay resultados, muestra el panel
        if (results) {
            return <ResultsPanel results={results} order={order} onNewOrder={handleNewOrder} signedData={signedData} />;
        }

        // Formulario de orden
        const isBalanceInsufficient = !demoMode && parseFloat(order.amount) > parseFloat(ethBalance);
        const buttonDisabled = !walletAddress || (!demoMode && isBalanceInsufficient) || (chainId !== null && chainId !== CHAIN_ID);
        
        return (
            <div>
                <h2 style={styles.sectionTitle}>Cargar Orden TWAP Privada</h2>
                <p style={styles.sectionSubtitle}>Define una orden para evitar que los bots MEV roben tu alfa</p>

                <form onSubmit={handleSubmit}>
                    {/* 🆕 Toggle de Modo Demo */}
                    <div style={{ padding: '15px', backgroundColor: demoMode ? '#00ff7f1a' : '#ffcc001a', border: `1px solid ${demoMode ? '#00ff7f' : '#ffcc00'}`, borderRadius: '8px', marginBottom: '20px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            <input 
                                type="checkbox" 
                                checked={demoMode} 
                                onChange={(e) => setDemoMode(e.target.checked)} 
                                style={{ marginRight: '10px', transform: 'scale(1.3)' }}
                            />
                            <span style={{ color: demoMode ? '#00ff7f' : '#ffcc00', fontWeight: 'bold' }}>
                                🎮 Modo Demo (Probar sin ETH real)
                            </span>
                        </label>
                        {demoMode && (
                            <p style={{ color: '#999', fontSize: '12px', marginTop: '8px', marginBottom: 0 }}>
                                ✅ Activo: Puedes firmar órdenes sin tener saldo ETH
                            </p>
                        )}
                    </div>

                    {/* Saldo Real */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Saldo ETH (Real)</label>
                        <input 
                            type="text" 
                            value={`${ethBalance} ETH`} 
                            readOnly 
                            style={{ ...styles.input, ...styles.balanceDisplay }} 
                        />
                    </div>

                    {/* Monto a Vender */}
                    <div style={styles.inputGroup}>
                        <label style={{ ...styles.label, color: isBalanceInsufficient ? '#ff4d4d' : styles.label.color }}>
                            Monto a Vender {isBalanceInsufficient && !demoMode && `(Saldo insuficiente)`}
                        </label>
                        <input 
                            type="number" 
                            name="amount" 
                            value={order.amount} 
                            onChange={handleChange} 
                            min="0.0001"
                            step="0.0001"
                            style={{ ...styles.input, border: isBalanceInsufficient && !demoMode ? '1px solid #ff4d4d' : styles.input.border }} 
                        />
                        <span style={styles.tokenLabel}>{order.tokenIn}</span>
                    </div>

                    {/* Token de Salida */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Token a Comprar</label>
                        <input 
                            type="text" 
                            name="tokenOut" 
                            value={order.tokenOut} 
                            onChange={handleChange} 
                            style={styles.input} 
                        />
                    </div>
                    
                    {/* Duración */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Duración (horas)</label>
                        <input 
                            type="number" 
                            name="duration" 
                            value={order.duration} 
                            onChange={handleChange} 
                            min="1" 
                            style={styles.input} 
                        />
                    </div>

                    {/* Aviso de Red Incorrecta */}
                    {chainId !== null && chainId !== CHAIN_ID && (
                        <div style={{ padding: '10px', backgroundColor: '#ff99001a', border: '1px solid #ff9900', borderRadius: '8px', marginBottom: '15px' }}>
                            <p style={{ color: '#ff9900', margin: 0 }}>
                                ⚠️ Estás en la red {chainId}. Cambia a **Ethereum Mainnet** (Chain ID: {CHAIN_ID})
                            </p>
                        </div>
                    )}
                    
                    <button 
                        type="submit"
                        disabled={buttonDisabled}
                        style={{
                            ...styles.submitOrderButton,
                            opacity: buttonDisabled ? 0.5 : 1,
                            cursor: buttonDisabled ? 'not-allowed' : 'pointer',
                            backgroundColor: demoMode ? '#00ff7f' : '#00ccff'
                        }}
                    >
                        {demoMode ? '🎮 Firmar Orden Demo' : 'Firmar y Enviar Orden Privada'}
                    </button>
                </form>
            </div>
        );
    };

    return (
        <div style={styles.mainLayout}>
            <div style={styles.header}>
                <div style={styles.logo}>Anti-MEV Dark Pool</div>
                <div style={styles.navLinks}>
                    {['Swap', 'Limit', 'TWAP', 'Learn'].map(name => (
                        <span 
                            key={name}
                            style={{ ...styles.navLink, ...getLinkStyle(name) }}
                            onMouseEnter={() => setHoveredLink(name)}
                            onMouseLeave={() => setHoveredLink(null)}
                        >
                            {name}
                        </span>
                    ))}
                </div>
                <div>
                    {!walletAddress ? (
                        <button onClick={connectWallet} style={styles.connectWalletButton}>
                            Conectar Billetera
                        </button>
                    ) : (
                        <div style={styles.connectedWalletInfo}>
                            <span style={styles.walletAddress}>
                                {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
                            </span>
                            <button onClick={disconnectWallet} style={styles.disconnectWalletButton}>
                                ✖️
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div style={styles.contentArea}>
                <div style={styles.leftPanel}>
                    {renderMainContent()}
                </div>
                <div style={styles.rightPanel}>
                    {!walletAddress && (
                        <div style={styles.connectWalletPlaceholder}>
                            <span style={{ fontSize: '3em', color: '#00ccff' }}>💳</span>
                            <h3 style={{ color: '#fff' }}>Conectar Billetera</h3>
                            <p style={{ color: '#999' }}>Conéctate para ver tu saldo real de ETH</p>
                        </div>
                    )}
                    {walletAddress && !results && (
                        <div style={styles.connectWalletPlaceholder}>
                            <span style={{ fontSize: '3em', color: '#ffcc00' }}>⏳</span>
                            <h3>Saldo Cargado</h3>
                            <p style={{ color: '#999' }}>
                                Tu saldo: <strong style={{ color: '#00ccff' }}>{ethBalance} ETH</strong>
                            </p>
                            <p style={{ color: '#999', fontSize: '12px', marginTop: '10px' }}>
                                Red: Chain ID {chainId || 'Desconocida'}
                            </p>
                        </div>
                    )}
                    {walletAddress && results && (
                        <div style={styles.connectWalletPlaceholder}>
                            <span style={{ fontSize: '3em', color: '#00ff7f' }}>📊</span>
                            <h3>Análisis Completo</h3>
                            <p style={{ color: '#999' }}>Tu ahorro se muestra en el panel izquierdo</p>
                        </div>
                    )}
                </div>
            </div>
            
            {statusMessage && (
                <div style={styles.globalStatusMessage}>
                    {statusMessage}
                </div>
            )}
        </div>
    );
}

export default OrderForm;