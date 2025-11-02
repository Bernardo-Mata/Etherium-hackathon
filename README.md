# Anti-MEV Dark Pool - Ethereum Hackathon

![Banner](https://img.shields.io/badge/Ethereum-Hackathon-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Version](https://img.shields.io/badge/version-1.0.0-orange)

## 📋 Descripción

**Anti-MEV Dark Pool** es una aplicación descentralizada (dApp) que permite a los usuarios ejecutar órdenes TWAP (Time-Weighted Average Price) de forma privada, protegiendo sus transacciones de bots MEV (Maximal Extractable Value) y front-running.

### 🎯 Características Principales

- ✅ **Ejecución Privada de Órdenes**: Protección contra MEV y front-running
- 🔐 **Cifrado de Órdenes**: Encriptación César (ROT13) para datos sensibles
- ✍️ **Firma Criptográfica**: Verificación de autenticidad mediante MetaMask
- 📊 **Simulación TWAP**: Visualización de ahorro vs. swap estándar
- 🎮 **Modo Demo**: Prueba sin gastar ETH real
- 🌐 **Multi-Chain**: Soporte para Ethereum, Scroll y Arbitrum

## 🏗️ Arquitectura del Proyecto

```
EtheriumMTY/
├── contracts/                          # Smart Contracts Solidity
│   └── SimpleHomomorphicEncryption.sol
├── scripts/                            # Scripts de deployment
│   └── deploy.js
├── src/                                # Backend refactorizado
│   ├── config/                         # Configuraciones
│   │   ├── server.config.js
│   │   └── constants.js
│   ├── controllers/                    # Controladores
│   │   └── orderController.js
│   ├── services/                       # Lógica de negocio
│   │   ├── signatureService.js
│   │   ├── encryptionService.js
│   │   └── twapService.js
│   ├── middlewares/                    # Middlewares
│   │   ├── logger.js
│   │   ├── errorHandler.js
│   │   └── validator.js
│   ├── routes/                         # Rutas de la API
│   │   └── orderRoutes.js
│   └── utils/                          # Utilidades
│       └── caesarCipher.js
├── Etherium-hackathon-main/
│   └── frontend/                       # Frontend React refactorizado
│       └── src/
│           ├── components/             # Componentes React
│           │   ├── AntiMevApp.jsx
│           │   ├── Header.jsx
│           │   ├── OrderFormFields.jsx
│           │   ├── ResultsPanel.jsx
│           │   ├── SidePanel.jsx
│           │   └── StatusMessage.jsx
│           ├── hooks/                  # Custom Hooks
│           │   ├── useWallet.js
│           │   └── useOrderForm.js
│           ├── services/               # Servicios API
│           │   ├── api.service.js
│           │   └── wallet.service.js
│           ├── config/                 # Configuraciones
│           │   ├── blockchain.config.js
│           │   └── api.config.js
│           ├── constants/              # Constantes
│           │   └── app.constants.js
│           ├── styles/                 # Estilos
│           │   └── componentStyles.js
│           └── utils/                  # Utilidades
│               ├── caesarCipher.js
│               └── format.utils.js
├── hardhat.config.js                   # Configuración Hardhat
├── package.json                        # Dependencias backend
├── server.refactored.js                # Servidor refactorizado
└── .env.example                        # Variables de entorno ejemplo
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- **Node.js** >= 16.x
- **npm** >= 8.x
- **MetaMask** extensión del navegador
- **Git**

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/EtheriumMTY.git
cd EtheriumMTY
```

### 2. Configurar Variables de Entorno

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones:

```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
ETHEREUM_RPC_URL=https://eth.llamarpc.com
# ... más configuraciones
```

### 3. Instalar Dependencias

#### Backend
```bash
npm install
```

#### Frontend
```bash
cd Etherium-hackathon-main/frontend
npm install
cd ../..
```

### 4. Ejecutar la Aplicación

#### Opción A: Ejecución Simultánea (Desarrollo)

```bash
# Terminal 1 - Backend
node server.refactorized.js

# Terminal 2 - Frontend
cd Etherium-hackathon-main/frontend
npm start
```

#### Opción B: Script de Desarrollo (si lo configuras)

```bash
npm run dev
```

### 5. Acceder a la Aplicación

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## 📖 Uso de la Aplicación

### 1. Conectar Wallet

1. Haz clic en **"Conectar Billetera"**
2. Autoriza la conexión en MetaMask
3. Verifica que estés en Ethereum Mainnet (Chain ID: 1)

### 2. Crear una Orden TWAP

1. Ingresa el **monto** en ETH que deseas vender
2. Selecciona el **token de salida** (ej: USDC)
3. Define la **duración** en horas
4. (Opcional) Activa el **Modo Demo** para probar sin ETH real
5. Haz clic en **"Firmar y Enviar Orden Privada"**
6. Firma el mensaje en MetaMask

### 3. Visualizar Resultados

La aplicación mostrará:
- 🚀 **Output Dark Pool**: Precio ideal sin MEV
- ❌ **Output Swap Estándar**: Con pérdida por MEV
- 💰 **Ahorro Total**: Diferencia preservada
- 📊 **Gráfico TWAP**: Distribución temporal

## 🔧 API Endpoints

### GET `/api/health`

Verifica el estado del servidor.

**Respuesta:**
```json
{
  "success": true,
  "message": "Servidor Anti-MEV funcionando correctamente",
  "timestamp": "2025-11-01T12:00:00.000Z",
  "version": "1.0.0"
}
```

### POST `/api/orden`

Procesa una orden TWAP encriptada y firmada.

**Body:**
```json
{
  "walletAddress": "0x123...",
  "messageToVerify": "{\"amount\":\"0.1\",\"tokenIn\":\"ETH\",...}",
  "signature": "0xabc...",
  "encryptedOrder": "encrypted_string"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Orden verificada...",
  "verificationStatus": "SUCCESS",
  "results": {
    "darkPoolOutput": "300.00",
    "normalSwapOutput": "291.00",
    "totalSavings": "9.00",
    ...
  }
}
```

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React** 19.2.0
- **ethers.js** 6.15.0
- **Recharts** 3.3.0 (gráficos)
- **MetaMask** (wallet provider)

### Backend
- **Node.js** / **Express.js**
- **ethers.js** 6.9.0 (verificación de firmas)
- **CORS** (seguridad)

### Smart Contracts
- **Solidity** ^0.8.0
- **Hardhat** (desarrollo y deployment)
- **Scroll** / **Arbitrum** (L2 chains)

## 🔐 Seguridad

### Medidas Implementadas

1. ✅ **Validación de Firmas**: Verificación criptográfica con ethers.js
2. ✅ **Cifrado de Órdenes**: Encriptación César (educativo)
3. ✅ **Validación de Entrada**: Middleware de validación
4. ✅ **CORS Configurado**: Solo frontend autorizado
5. ✅ **Límite de Body Size**: Protección contra payloads grandes

### Recomendaciones para Producción

- 🔄 Reemplazar cifrado César por **AES-256-GCM**
- 🔄 Implementar **rate limiting**
- 🔄 Usar **HTTPS** obligatorio
- 🔄 Agregar **autenticación JWT**
- 🔄 Implementar **logging profesional** (Winston, Pino)
- 🔄 Deploy en **infraestructura segura** (AWS, Azure)

## 📊 Despliegue de Contratos

### Local (Hardhat)

```bash
npx hardhat compile
npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

### Scroll Sepolia Testnet

```bash
npx hardhat run scripts/deploy.js --network scrollSepolia
```

### Arbitrum Sepolia Testnet

```bash
npx hardhat run scripts/deploy.js --network arbitrumSepolia
```

## 🧪 Testing

```bash
# Backend tests (si los implementas)
npm test

# Frontend tests
cd Etherium-hackathon-main/frontend
npm test
```

## 📝 Buenas Prácticas Implementadas

### Código
- ✅ **Separación de responsabilidades**: Arquitectura MVC
- ✅ **Documentación JSDoc**: Todas las funciones documentadas
- ✅ **Nombres descriptivos**: Variables y funciones claras
- ✅ **Manejo de errores**: Try-catch y middlewares
- ✅ **Validaciones**: Entrada sanitizada
- ✅ **Modularidad**: Componentes reutilizables

### React
- ✅ **Custom Hooks**: useWallet, useOrderForm
- ✅ **Componentes funcionales**: Sin clases
- ✅ **Props tipadas**: Documentación clara
- ✅ **Separación de estilos**: Archivo centralizado

### Backend
- ✅ **Controladores**: Lógica separada
- ✅ **Servicios**: Reutilizables
- ✅ **Middlewares**: Logging, validación, errores
- ✅ **Configuración**: Variables de entorno

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.

## 👥 Autores

- **Equipo Anti-MEV** - Ethereum Hackathon MTY 2025

## 🙏 Agradecimientos

- Comunidad de Ethereum
- Scroll Network
- Arbitrum
- OpenZeppelin
- Hardhat Team

---

**⚠️ Disclaimer**: Este proyecto es educativo y de demostración. No debe usarse en producción sin auditorías de seguridad profesionales.


---
Link del Demo:
https://youtu.be/MlOtTRyEIzg