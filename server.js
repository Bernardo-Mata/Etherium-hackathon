// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// Importar ethers para la verificación de firma en el backend
const { ethers } = require('ethers'); 

const app = express();
const PORT = 3001; // El backend correrá en 3001 (Correcto)

// --- Configuración CORS Corregida ---
const corsOptions = {
    // CORRECCIÓN: Permitimos explícitamente que el frontend (que corre en 3000) se conecte.
    origin: 'http://localhost:3000', 
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions)); 

app.use(bodyParser.json());

// --- ENDPOINT PRINCIPAL: RECIBIR Y VERIFICAR ORDEN ---
app.post('/api/orden', async (req, res) => {
    const { 
        walletAddress, 
        messageToVerify, 
        signature, 
        amount, 
        duration,
        ...rest 
    } = req.body;

    if (!walletAddress || !messageToVerify || !signature) {
        return res.status(400).json({ message: 'Faltan datos de autenticación (dirección, mensaje o firma).' });
    }

    try {
        // --- LA VERIFICACIÓN CRÍTICA DE BLOCKCHAIN ---
        const signerAddress = ethers.verifyMessage(messageToVerify, signature);

        console.log(`Dirección Recuperada de la Firma: ${signerAddress}`);
        console.log(`Dirección Proporcionada por el Usuario: ${walletAddress}`);

        if (signerAddress.toLowerCase() !== walletAddress.toLowerCase()) {
            console.error('VERIFICACIÓN FALLIDA: Las direcciones no coinciden.');
            return res.status(403).json({ 
                message: '❌ Firma Inválida. La orden no fue autorizada por esta billetera.',
                expectedAddress: walletAddress,
                signerAddress: signerAddress
            });
        }

        console.log('✅ VERIFICACIÓN DE FIRMA EXITOSA: Orden auténtica.');

        // 3. Simulación de Ejecución TWAP
        const IDEAL_PRICE = 3000; // Usamos 3000 DAI por consistencia
        const inputAmount = parseFloat(amount);
        
        const totalOutputIdeal = inputAmount * IDEAL_PRICE;
        const MEV_SLIPPAGE_PENALTY_RATE = 0.03; 
        const totalOutputNormal = totalOutputIdeal * (1 - MEV_SLIPPAGE_PENALTY_RATE);
        const savings = totalOutputIdeal - totalOutputNormal;

        // 4. Respuesta con los resultados de la simulación
        res.status(200).json({ 
            message: 'Orden verificada y simulación TWAP completada.', 
            verificationStatus: 'SUCCESS',
            results: {
                totalInputAmount: amount,
                durationHours: duration,
                darkPoolOutput: totalOutputIdeal.toFixed(2),
                normalSwapOutput: totalOutputNormal.toFixed(2),
                totalSavings: savings.toFixed(2)
            }
        });

    } catch (error) {
        console.error("Error en el backend durante la verificación:", error.message);
        return res.status(400).json({ 
            message: '❌ Error: La firma no es válida o el mensaje está corrupto. (Revisar JSON.stringify en el frontend).', 
            error: error.message 
        });
    }
});

app.get('/', (req, res) => {
    res.send(`Servidor Anti-MEV corriendo en el puerto ${PORT}`);
});

app.listen(PORT, () => {
    console.log(`Backend Anti-MEV escuchando en http://localhost:${PORT}`); 
});