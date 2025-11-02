# 📚 Documentación de Arquitectura - Anti-MEV Dark Pool

## 🏛️ Arquitectura General

### Capas de la Aplicación

```
┌─────────────────────────────────────────────────────────┐
│                    CAPA DE PRESENTACIÓN                 │
│  ┌──────────────────────────────────────────────────┐  │
│  │           Frontend React (Puerto 3000)            │  │
│  │  - Componentes UI (Header, OrderForm, Results)   │  │
│  │  - Custom Hooks (useWallet, useOrderForm)        │  │
│  │  - Servicios (API, Wallet)                       │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↓ HTTPS/JSON
┌─────────────────────────────────────────────────────────┐
│                    CAPA DE APLICACIÓN                   │
│  ┌──────────────────────────────────────────────────┐  │
│  │        Backend Express.js (Puerto 3001)          │  │
│  │  - Rutas (orderRoutes)                           │  │
│  │  - Controladores (orderController)               │  │
│  │  - Middlewares (logger, validator, errorHandler) │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                    CAPA DE NEGOCIO                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │                   Servicios                       │  │
│  │  - signatureService (Verificación de firmas)     │  │
│  │  - encryptionService (Cifrado/Descifrado)        │  │
│  │  - twapService (Simulación TWAP)                 │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                   CAPA DE BLOCKCHAIN                    │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Ethereum / Scroll / Arbitrum             │  │
│  │  - Smart Contracts (Solidity)                    │  │
│  │  - Verificación on-chain (futuro)                │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## 🔄 Flujo de Datos

### 1. Flujo de Creación de Orden

```
Usuario → [Frontend]
    ↓
1. Conecta Wallet (MetaMask)
    ↓
2. Completa formulario de orden
    ↓
3. Encripta datos con Caesar Cipher
    ↓
4. Firma mensaje con MetaMask (EIP-191)
    ↓
5. Envía al backend via API
    ↓
[Backend]
    ↓
6. Valida entrada (validator middleware)
    ↓
7. Verifica firma (signatureService)
    ↓
8. Desencripta orden (encryptionService)
    ↓
9. Simula ejecución TWAP (twapService)
    ↓
10. Retorna resultados
    ↓
[Frontend]
    ↓
11. Muestra resultados con gráficos
```

## 📦 Módulos y Responsabilidades

### Frontend

#### **Componentes** (`src/components/`)
- **AntiMevApp.jsx**: Componente principal, orquesta toda la aplicación
- **Header.jsx**: Navegación y botón de wallet
- **OrderFormFields.jsx**: Formulario de entrada de órdenes
- **ResultsPanel.jsx**: Visualización de resultados con gráficos
- **SidePanel.jsx**: Panel lateral informativo
- **StatusMessage.jsx**: Mensajes de estado flotantes

#### **Custom Hooks** (`src/hooks/`)
- **useWallet.js**: Manejo del estado de la wallet
  - Conexión/desconexión
  - Lectura de balance
  - Firma de mensajes
  - Eventos de MetaMask
  
- **useOrderForm.js**: Manejo del formulario de órdenes
  - Validación de campos
  - Estado del formulario
  - Manejo de errores

#### **Servicios** (`src/services/`)
- **wallet.service.js**: Interacción con blockchain
  - Provider de ethers.js
  - Operaciones de wallet
  - Cambio de red
  
- **api.service.js**: Comunicación con backend
  - Peticiones HTTP
  - Manejo de timeouts
  - Procesamiento de respuestas

#### **Utilidades** (`src/utils/`)
- **caesarCipher.js**: Encriptación/desencriptación
- **format.utils.js**: Formateo de datos (direcciones, montos, fechas)

### Backend

#### **Controladores** (`src/controllers/`)
- **orderController.js**: Lógica de endpoints
  - `processOrder()`: Procesa órdenes firmadas
  - `getHealth()`: Health check del servidor

#### **Servicios** (`src/services/`)
- **signatureService.js**: Verificación criptográfica
  - Verifica firmas EIP-191
  - Valida direcciones
  - Normaliza addresses (checksum)

- **encryptionService.js**: Cifrado
  - Desencripta órdenes
  - Valida estructura de datos

- **twapService.js**: Simulación TWAP
  - Calcula outputs ideal vs normal
  - Genera cronograma de ejecución
  - Calcula ahorros

#### **Middlewares** (`src/middlewares/`)
- **logger.js**: Logging de requests
- **errorHandler.js**: Manejo centralizado de errores
- **validator.js**: Validación de entrada

#### **Rutas** (`src/routes/`)
- **orderRoutes.js**: Definición de endpoints
  - `POST /api/orden`
  - `GET /api/health`

## 🔐 Seguridad

### Medidas Implementadas

1. **Validación de Firmas Criptográficas**
   - Usa ethers.js para verificar firmas EIP-191
   - Compara direcciones case-insensitive
   - Rechaza firmas inválidas con 403 Forbidden

2. **Validación de Entrada**
   - Middleware que valida formato de datos
   - Verifica tipos de datos
   - Límite de tamaño de body (100KB)

3. **CORS Configurado**
   - Solo permite origen del frontend (localhost:3000)
   - Credenciales habilitadas
   - Headers específicos permitidos

4. **Cifrado de Datos**
   - Encriptación César para órdenes en tránsito
   - Desencriptación solo en backend
   - (⚠️ Educativo, usar AES-256 en producción)

5. **Manejo de Errores**
   - No expone stack traces en producción
   - Mensajes de error sanitizados
   - Logging detallado solo en desarrollo

### Recomendaciones para Producción

```javascript
// ❌ NO hacer (actual - educativo):
const encryptedOrder = caesarEncrypt(orderJson, 13);

// ✅ SÍ hacer (producción):
const crypto = require('crypto');
const algorithm = 'aes-256-gcm';
const key = crypto.scryptSync(process.env.SECRET_KEY, 'salt', 32);
const iv = crypto.randomBytes(16);
const cipher = crypto.createCipheriv(algorithm, key, iv);
// ... encriptar con AES-256-GCM
```

## 🎯 Patrones de Diseño

### 1. Singleton Pattern
Usado en servicios para evitar múltiples instancias:

```javascript
// services/signatureService.js
class SignatureService {
  // ... métodos
}

module.exports = new SignatureService(); // Singleton
```

### 2. Middleware Pattern
Para procesamiento secuencial de requests:

```javascript
app.use(logger);
app.use(validateBodySize());
app.post('/api/orden', validateOrderData, orderController.processOrder);
app.use(errorHandler);
```

### 3. Service Layer Pattern
Separación de lógica de negocio:

```
Controller → Service → Database/Blockchain
```

### 4. Custom Hooks Pattern (React)
Reutilización de lógica de estado:

```javascript
const { walletAddress, connect, disconnect } = useWallet();
const { order, errors, validateForm } = useOrderForm();
```

### 5. Composition Pattern (React)
Componentes componibles y reutilizables:

```javascript
<AntiMevApp>
  <Header>
    <Navigation />
    <WalletButton />
  </Header>
  <OrderFormFields />
  <ResultsPanel />
</AntiMevApp>
```

## 📊 Flujo de Estado (React)

```
┌─────────────────────────────────────────────────┐
│              useWallet Hook                     │
│  - walletAddress                                │
│  - ethBalance                                   │
│  - chainId                                      │
│  - connect(), disconnect(), signMessage()       │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│            AntiMevApp Component                 │
│  - demoMode, statusMessage, results             │
│  - handleSubmit(), handleConnect(), etc.        │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│        Child Components (presentational)        │
│  - Header, OrderFormFields, ResultsPanel        │
│  - Reciben props, no manejan estado complejo    │
└─────────────────────────────────────────────────┘
```

## 🧪 Testing (Recomendaciones)

### Frontend
```javascript
// tests/useWallet.test.js
describe('useWallet', () => {
  it('should connect wallet successfully', async () => {
    const { result } = renderHook(() => useWallet());
    await act(async () => {
      await result.current.connect();
    });
    expect(result.current.isConnected).toBe(true);
  });
});
```

### Backend
```javascript
// tests/signatureService.test.js
describe('SignatureService', () => {
  it('should verify valid signature', () => {
    const result = signatureService.verifySignature(
      message,
      signature,
      address
    );
    expect(result.isValid).toBe(true);
  });
});
```

## 🚀 Optimizaciones Futuras

### Frontend
- [ ] Implementar React.memo para componentes pesados
- [ ] Usar useMemo/useCallback para optimizar renders
- [ ] Code splitting con React.lazy
- [ ] Service Worker para offline support
- [ ] Web3Modal para múltiples wallets

### Backend
- [ ] Implementar caché con Redis
- [ ] Rate limiting por IP/wallet
- [ ] Comprensión gzip
- [ ] Clustering para múltiples workers
- [ ] WebSocket para actualizaciones en tiempo real

### Blockchain
- [ ] Implementar verificación on-chain
- [ ] Integrar con oráculos de precios (Chainlink)
- [ ] Usar Layer 2 (Optimism, Arbitrum, Scroll)
- [ ] Implementar zkSNARKs para privacidad total

## 📝 Convenciones de Código

### Naming Conventions
```javascript
// Componentes: PascalCase
const OrderFormFields = () => { ... };

// Variables/funciones: camelCase
const walletAddress = '0x...';
const handleSubmit = () => { ... };

// Constantes: UPPER_SNAKE_CASE
const DEFAULT_CHAIN_ID = 1;

// Archivos: kebab-case
order-controller.js
wallet.service.js
```

### JSDoc
```javascript
/**
 * Descripción de la función
 * @param {string} param1 - Descripción del parámetro
 * @param {number} [param2=10] - Parámetro opcional con default
 * @returns {Object} Descripción del retorno
 * @throws {Error} Cuándo lanza error
 * @example
 * functionName('ejemplo', 5) // Output esperado
 */
function functionName(param1, param2 = 10) {
  // ...
}
```

## 🔗 Referencias

- [Ethereum Yellow Paper](https://ethereum.github.io/yellowpaper/paper.pdf)
- [EIP-191: Signed Data Standard](https://eips.ethereum.org/EIPS/eip-191)
- [React Best Practices](https://react.dev/learn/thinking-in-react)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)

---

**Última actualización**: Noviembre 2025
