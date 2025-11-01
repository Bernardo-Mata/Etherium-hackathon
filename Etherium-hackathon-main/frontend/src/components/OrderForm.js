// src/OrderForm.js (o App.js)

import React, { useState } from 'react';
import { ethers } from 'ethers';
import './App.css'; // Asumiendo que tienes un archivo CSS para estilo

const API_URL = 'http://localhost:3001/api/orden';

function OrderForm() {
    const [walletAddress, setWalletAddress] = useState('');
    const [order, setOrder] = useState({ 
        amount: 100, 
        tokenIn: 'ETH', 
        tokenOut: 'DAI', 
        duration: 24 
    });
    const [statusMessage, setStatusMessage] = useState('');

    // --- PASO 1: CONECTAR BILLETERA ---
    const connectWallet = async () => {
        if (!window.ethereum) {
            alert('Por favor, instala MetaMask para usar esta aplicación.');
            return;
        }

        try {
            // Un proveedor (provider) es una conexión de solo lectura a la blockchain
            const provider = new ethers.BrowserProvider(window.ethereum);
            
            // Pide acceso a las cuentas y obtiene el firmante (signer)
            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            
            const address = await signer.getAddress();
            setWalletAddress(address);
            setStatusMessage("Conectado: ${address.substring(0, 6)}...");

        } catch (error) {
            console.error("Error conectando la billetera:", error);
            setStatusMessage("Error al conectar. ¿Tienes MetaMask instalado?");
        }
    };

    const handleChange = (e) => {
        setOrder({ ...order, [e.target.name]: e.target.value });
    };

    // --- PASO 2 & 3: FIRMAR Y ENVIAR LA ORDEN ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!walletAddress) {
            setStatusMessage("Por favor, conecta tu billetera primero.");
            return;
        }
        
        try {
            setStatusMessage("1. Firmando la orden...");

            // El proveedor de la billetera que nos permitirá firmar
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            // CONSTRUIR EL MENSAJE A FIRMAR
            // Este mensaje DEBE ser una cadena de texto (string) que resume la orden.
            const message = JSON.stringify({
                // Estos son los datos que la billetera está confirmando
                amount: order.amount,
                tokenIn: order.tokenIn,
                tokenOut: order.tokenOut,
                duration: order.duration,
                timestamp: Date.now() // Añadir un timestamp para evitar ataques de repetición
            });

            // LA FUNCIÓN CLAVE: Solicita a MetaMask que firme el mensaje
            const signature = await signer.signMessage(message);
            
            setStatusMessage("2. Firma generada con éxito. Enviando al backend...");

            // Enviar la orden completa (datos + dirección + firma) al backend
            const payload = {
                ...order,
                walletAddress,
                messageToVerify: message, // Enviamos el mensaje que fue firmado
                signature // Enviamos la firma criptográfica
            };

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            
            if (response.ok) {
                setStatusMessage("✅ Orden enviada! Mensaje del Backend: ${data.message}");
                // Aquí podrías redirigir al ResultsPanel
            } else {
                setStatusMessage("❌ Error del Backend: ${data.message}");
            }

        } catch (error) {
            console.error("Error en el proceso de firma/envío:", error);
            setStatusMessage("❌ Falló la operación. Revisa la consola y MetaMask.");
        }
    };

    return (
        <div className="container">
            <h1>Anti-MEV Dark Pool - Carga de Órdenes</h1>
            
            <button onClick={connectWallet} disabled={!!walletAddress}>
                {walletAddress ? "Billetera Conectada" : "Conectar Billetera (MetaMask)"}
            </button>
            <p className="status-bar">{statusMessage}</p>

            <form onSubmit={handleSubmit} className="order-form">
                <h2>Cargar Orden TWAP Privada</h2>
                
                <label>
                    Monto a Vender:
                    <input type="number" name="amount" value={order.amount} onChange={handleChange} required />
                </label>
                <label>
                    Token de Salida:
                    <input type="text" name="tokenIn" value={order.tokenIn} onChange={handleChange} required />
                </label>
                 <label>
                    Token de Entrada:
                    <input type="text" name="tokenOut" value={order.tokenOut} onChange={handleChange} required />
                </label>
                <label>
                    Duración (horas):
                    <input type="number" name="duration" value={order.duration} onChange={handleChange} min="1" required />
                </label>

                <button type="submit" disabled={!walletAddress}>
                    Firmar y Enviar Orden Privada
                </button>
            </form>
        </div>
    );
}

export default OrderForm;