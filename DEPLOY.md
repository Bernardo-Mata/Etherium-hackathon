# Guía de Despliegue a Scroll y Arbitrum

Este contrato está listo para ser desplegado en **Scroll** y **Arbitrum** (tanto en mainnet como en testnets).

## 📋 Requisitos Previos

1. **Node.js** instalado (v18 o superior)
2. **Fondos** en tu wallet para pagar gas:
   - Scroll Sepolia: ETH en Sepolia (puente desde Ethereum Sepolia)
   - Arbitrum Sepolia: ETH en Arbitrum Sepolia
   - Scroll Mainnet: ETH en Scroll
   - Arbitrum Mainnet: ETH en Arbitrum

## 🚀 Pasos de Despliegue

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

Edita `.env` y agrega tu clave privada:

```
PRIVATE_KEY=tu_clave_privada_aqui
```

**⚠️ IMPORTANTE:** Nunca compartas tu clave privada ni la subas a Git.

### 3. Compilar el Contrato

```bash
npm run compile
```

### 4. Desplegar el Contrato

#### Scroll Sepolia (Testnet)
```bash
npm run deploy:scroll-sepolia
```

#### Scroll Mainnet
```bash
npm run deploy:scroll
```

#### Arbitrum Sepolia (Testnet)
```bash
npm run deploy:arbitrum-sepolia
```

#### Arbitrum Mainnet
```bash
npm run deploy:arbitrum
```

## 🔍 Verificación del Contrato

Después del despliegue, el script mostrará:
- ✅ Dirección del contrato desplegado
- 🔗 Enlace al explorer para verificar

### Explorers:

- **Scroll Mainnet**: https://scrollscan.com
- **Scroll Sepolia**: https://sepolia.scrollscan.com
- **Arbitrum Mainnet**: https://arbiscan.io
- **Arbitrum Sepolia**: https://sepolia.arbiscan.io

## 📝 Notas Importantes

1. **Gas Fees**: Las redes L2 (Scroll y Arbitrum) tienen tarifas de gas mucho más bajas que Ethereum mainnet.

2. **Compatibilidad**: El contrato usa Solidity 0.8.0 y es compatible con ambas redes.

3. **Opcodes**: El contrato usa `block.prevrandao` que está disponible en ambas redes desde la fusión (Merge).

4. **Testnet primero**: Se recomienda desplegar primero en testnet para verificar que todo funciona correctamente.

## 🛠️ Solución de Problemas

### Error: "insufficient funds"
- Asegúrate de tener fondos en tu wallet para la red correspondiente.

### Error: "nonce too high"
- Espera unos segundos e intenta nuevamente.

### Error de compilación
- Verifica que tienes Node.js v18+ instalado.
- Ejecuta `npm install` nuevamente.

