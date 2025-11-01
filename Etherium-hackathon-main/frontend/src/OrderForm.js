import React, { useState } from 'react';
import { ethers } from 'ethers';
// Importaciones para conexión múltiple
import WalletConnectProvider from '@walletconnect/web3-provider'; 
import Web3Modal from 'web3modal';
// Importación del cifrado César para encriptar la orden
import { encryptOrder, DEFAULT_SHIFT } from './utils/caesarCipher'; 
// Asume que la ID de proyecto de WalletConnect ha sido obtenida
const WALLETCONNECT_PROJECT_ID = '5960bf846eaed41dd77ddbc1b0e27ede'; 
const API_URL = '/api/orden'; 

// --- CONSTANTES DEL SMART CONTRACT ---
const UNI_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
];
const UNI_ADDRESS = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F982"; // Dirección real del token UNI
const CHAIN_ID = 1; // Ethereum Mainnet
// ------------------------------------

// --- Componente de Visualización de Resultados ---
const ResultsPanel = ({ results, order, onNewOrder, signedData }) => {
    const [showReceipt, setShowReceipt] = useState(false); 

    const formatCurrency = (value) => parseFloat(value).toLocaleString('es-ES', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    });

    return (
        <div className="results-container">
            <h2>✨ ¡Orden Privada Ejecutada con Éxito!</h2>
            <p className="subtitle">
                Se ejecutó su orden de **{order.amount} {order.tokenIn}** de forma privada, eliminando el riesgo de MEV.
            </p>
            
            <div className="comparison-grid">
                <div className="result-card ideal">
                    <h3>🚀 Resultado del Dark Pool (Anti-MEV)</h3>
                    <p className="value">Recibido: **{formatCurrency(results.darkPoolOutput)} USDC/DAI**</p>
                    <p className="detail">Precio ideal sin deslizamiento. Orden autenticada con firma criptográfica.</p>
                </div>
                
                <div className="result-card normal">
                    <h3>❌ Swap Estándar (Mercado Abierto)</h3>
                    <p className="value">Recibido: **{formatCurrency(results.normalSwapOutput)} USDC/DAI**</p>
                    <p className="detail">Resultado simulado con un 3% de pérdida por MEV y deslizamiento.</p>
                </div>
            </div>

            <div className="savings-highlight">
                <h3>💰 ¡Ahorro Total Preservado!</h3>
                <p className="savings-value">
                    {formatCurrency(results.totalSavings)} USDC/DAI
                </p>
                <p>Este es el valor que su DAO o estrategia algorítmica preservó al usar la ejecución privada.</p>
            </div>

            {/* --- INFORMACIÓN DE ENCRIPTACIÓN --- */}
            {results.encryptionUsed && (
                <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #28a745', borderRadius: '8px', textAlign: 'left', backgroundColor: '#f0fff4' }}>
                    <h4 style={{ color: '#28a745', marginTop: '0' }}>🔒 Orden Encriptada</h4>
                    <p style={{ margin: '5px 0' }}><strong>Método:</strong> {results.encryptionUsed}</p>
                    <p style={{ margin: '5px 0', fontSize: '0.9em', color: '#666' }}>
                        Los datos de la orden fueron encriptados usando cifrado César (ROT13) antes de ser procesados en la simulación.
                        Esto ayuda a proteger la información sensible durante la transmisión.
                    </p>
                </div>
            )}
            
            {/* --- INTEGRACIÓN DEL RECIBO CRIPTOGRÁFICO --- */}
            <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #007bff', borderRadius: '8px', textAlign: 'left' }}>
                <button onClick={() => setShowReceipt(!showReceipt)} className="toggle-receipt-button" style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', fontWeight: 'bold' }}>
                    {showReceipt ? 'Ocultar Recibo Criptográfico' : 'Ver Recibo Criptográfico (Prueba Blockchain)'}
                </button>
                
                {showReceipt && signedData && (
                    <div className="receipt-details" style={{ marginTop: '10px', fontSize: '0.9em' }}>
                        <h4>Detalles de la Firma (Prueba Blockchain):</h4>
                        <p><strong>Dirección del Firmante:</strong> <code>{signedData.walletAddress}</code></p>
                        <p><strong>Mensaje Original (JSON de Orden):</strong> <code>{signedData.message}</code></p>
                        <p><strong>Firma Cryptográfica:</strong> <code>{signedData.signature.substring(0, 60)}...</code></p>
                        <p style={{ color: '#28a745', marginTop: '10px' }}>Esta prueba vincula criptográficamente la orden a la billetera, garantizando la **auditabilidad** y autenticidad.</p>
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
// ---------------------------------------------


function OrderForm() {
    const [walletAddress, setWalletAddress] = useState('');
    const [currentProvider, setCurrentProvider] = useState(null); 
    
    // MODIFICACIÓN FINAL: TOKEN UNI/USDC
    const [order, setOrder] = useState({ 
        amount: 500, 
        tokenIn: 'UNI', 
        tokenOut: 'USDC', 
        duration: 48 
    });
    
    const [statusMessage, setStatusMessage] = useState('');
    const [results, setResults] = useState(null); 
    const [signedData, setSignedData] = useState(null); 

    // --- FUNCIÓN 1: CONEXIÓN DE BILLETERA (WEB3MODAL) ---
    const connectWallet = async () => {
        const providerOptions = {
            injected: {
                display: {
                    name: "MetaMask",
                    description: "Connect with MetaMask"
                },
                package: null
            },
            walletconnect: {
                package: WalletConnectProvider,
                options: {
                    infuraId: WALLETCONNECT_PROJECT_ID,
                    chainId: CHAIN_ID, // Usamos la constante 1
                }
            }
        };

        const web3Modal = new Web3Modal({
            cacheProvider: true,
            providerOptions
        });

        try {
            const web3Provider = await web3Modal.connect(); 
            const provider = new ethers.BrowserProvider(web3Provider);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            
            // --- LÓGICA DE INTERACCIÓN CON EL SMART CONTRACT ---
            let statusText = `Conectado: ${address.substring(0, 6)}...`;

            try {
                // 1. Crear instancia del contrato UNI (lectura)
                const uniContract = new ethers.Contract(UNI_ADDRESS, UNI_ABI, provider);
                
                // 2. Leer el saldo del Smart Contract
                const balanceRaw = await uniContract.balanceOf(address);
                const decimals = await uniContract.decimals();
                
                // 3. Formatear y Mostrar
                const balanceFormatted = ethers.formatUnits(balanceRaw, decimals);
                
                statusText = `✅ Conectado. Saldo UNI (SC): ${parseFloat(balanceFormatted).toFixed(2)}`;
                
            } catch (scError) {
                // Si la red no es Mainnet o hay un fallo, se usa el mensaje por defecto.
                statusText = `✅ Conectado. Error al leer el Saldo UNI (SC).`;
            }
            // ---------------------------------------------------
            
            setWalletAddress(address);
            setCurrentProvider(provider); 
            setStatusMessage(statusText); // Usamos el mensaje actualizado

        } catch (error) {
            console.error("Error conectando la billetera:", error);
            setStatusMessage("Error al conectar. Usuario canceló o fallo de conexión.");
        }
    };
    // -------------------------------------------------------------

    const handleChange = (e) => {
        setOrder({ ...order, [e.target.name]: e.target.value });
    };
    
    const handleNewOrder = () => {
        setResults(null);
        setSignedData(null); 
        setStatusMessage('');
    };

    // --- FUNCIÓN 2: FIRMAR Y ENVIAR LA ORDEN ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!walletAddress || !currentProvider) {
            setStatusMessage("Por favor, conecta tu billetera primero.");
            return;
        }
        
        try {
            setStatusMessage("1. Solicitando firma a la billetera (Prueba de autenticidad)...");

            const signer = await currentProvider.getSigner(); 

            // El mensaje debe ser consistente (strings) para la verificación
            const message = JSON.stringify({
                amount: order.amount.toString(),
                tokenIn: order.tokenIn,
                tokenOut: order.tokenOut,
                duration: order.duration.toString(),
                timestamp: Date.now().toString()
            });

            const signature = await signer.signMessage(message);
            
            // Almacenar datos firmados para el recibo criptográfico
            setSignedData({ 
                walletAddress, 
                message, 
                signature 
            }); 

            setStatusMessage("2. Firma generada. Encriptando orden para simulación privada...");

            // Preparar SOLO los datos de la orden para encriptar (NO incluye wallet, firma ni mensaje)
            // Este es el JSON que se encripta: {"amount":"500","tokenIn":"UNI","tokenOut":"USDC","duration":"48","timestamp":"..."}
            const orderData = {
                amount: order.amount.toString(),
                tokenIn: order.tokenIn,
                tokenOut: order.tokenOut,
                duration: order.duration.toString(),
                timestamp: Date.now().toString()
            };

            // Encriptar SOLO los datos de la orden usando cifrado César
            const encryptedOrder = encryptOrder(orderData, DEFAULT_SHIFT);

            // Payload con orden encriptada (wallet NO se encripta)
            const payload = {
                encryptedOrder, // Solo la orden encriptada: {"amount":"...","tokenIn":"...","tokenOut":"...","duration":"...","timestamp":"..."}
                walletAddress, // NO ENCRIPTADO - se envía en texto plano
                messageToVerify: message, // NO ENCRIPTADO - mensaje original firmado (para verificación)
                signature // NO ENCRIPTADO - firma criptográfica
            };

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            
            if (response.ok && data.verificationStatus === 'SUCCESS') {
                setStatusMessage(`✅ Orden autenticada. Simulación de ahorro completada.`);
                setResults(data.results);
            } else {
                setStatusMessage(`❌ Error: ${data.message || 'Fallo en la verificación de firma.'}`);
                setResults(null);
                setSignedData(null); 
            }

        } catch (error) {
            console.error("Error en el proceso de firma/envío:", error);
            setStatusMessage(`❌ Falló la operación. Revisa la consola.`);
            setSignedData(null); 
        }
    };
    
    // Función para renderizar el contenido
    const renderContent = () => {
        if (results) {
            return <ResultsPanel results={results} order={order} onNewOrder={handleNewOrder} signedData={signedData} />;
        }
        
        return (
            <form onSubmit={handleSubmit} className="order-form">
                <h1>--- ¡HOLAAAA HACKATHON! ---</h1> 
                <h2>Cargar Orden TWAP Privada</h2>
                <p>Define una orden a largo plazo para evitar que los bots MEV roben tu alfa.</p>

                <label>Monto a Vender: <input type="number" name="amount" value={order.amount} onChange={handleChange} required min="1" /></label>
                <label>Token a Vender: <input type="text" name="tokenIn" value={order.tokenIn} onChange={handleChange} required /></label>
                 <label>Token a Comprar: <input type="text" name="tokenOut" value={order.tokenOut} onChange={handleChange} required /></label>
                <label>Duración de la Ejecución (horas): <input type="number" name="duration" value={order.duration} onChange={handleChange} min="1" required /></label>
                
                <button type="submit" disabled={!walletAddress}>
                    Firmar y Enviar Orden Privada
                </button>
            </form>
        );
    };

    return (
        <div className="container">
            <h1>Anti-MEV Dark Pool (Uniswap v4 Concepto)</h1>
            
            <button onClick={connectWallet} disabled={!!walletAddress} className={`wallet-button ${walletAddress ? 'connected' : ''}`}>
                {walletAddress ? `Conectado: ${walletAddress.substring(0, 10)}...` : "Conectar Billetera"}
            </button>
            <p className="status-bar">{statusMessage}</p>

            {renderContent()}
        </div>
    );
}

export default OrderForm;