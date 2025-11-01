# 🔒 Implementación de Cifrado César para Simulación de Órdenes

## 📋 Resumen

Se implementó un sistema de cifrado César simple y de bajo costo para encriptar los datos de las órdenes antes de enviarlas al backend para simulación.

## 🎯 Objetivo

Encriptar los datos de la orden simulada usando un método simple y barato (tipo César) para proteger la información durante la transmisión.

## 🔧 Implementación

### 1. **Funciones de Cifrado César**

#### Frontend: `frontend/src/utils/caesarCipher.js`
- `caesarEncrypt()`: Encripta texto usando ROT (rotación de caracteres)
- `caesarDecrypt()`: Desencripta texto
- `encryptOrder()`: Encripta objetos JSON
- `decryptOrder()`: Desencripta objetos JSON

#### Backend: `utils/caesarCipher.js`
- Mismas funciones para Node.js (formato CommonJS)

### 2. **Flujo de Encriptación**

```
1. Usuario completa el formulario de orden
   ↓
2. Usuario firma el mensaje con su wallet
   ↓
3. Frontend encripta los datos de la orden (amount, tokens, duration)
   ↓
4. Se envía al backend:
   - encryptedOrder: Orden encriptada con cifrado César
   - messageToVerify: Mensaje original (sin encriptar, para verificación)
   - signature: Firma criptográfica del mensaje
   - walletAddress: Dirección de la wallet
   ↓
5. Backend verifica la firma criptográfica
   ↓
6. Backend desencripta la orden usando cifrado César
   ↓
7. Backend procesa la simulación con los datos desencriptados
   ↓
8. Backend retorna resultados de la simulación
```

### 3. **Archivos Modificados**

#### `frontend/src/OrderForm.js`
- ✅ Import de funciones de cifrado César
- ✅ Encriptación de datos de la orden antes de enviar al backend
- ✅ Actualización del payload para incluir `encryptedOrder`

#### `server.js`
- ✅ Import de funciones de descifrado César
- ✅ Desencriptación de la orden antes de procesar la simulación
- ✅ Manejo de errores de desencriptación
- ✅ Respuesta incluye información sobre el cifrado usado

#### `frontend/src/utils/caesarCipher.js` (NUEVO)
- Funciones de cifrado/descifrado para React

#### `utils/caesarCipher.js` (NUEVO)
- Funciones de cifrado/descifrado para Node.js

### 4. **Características del Cifrado César**

- **Simple**: Fácil de implementar y entender
- **Rápido**: Operaciones muy eficientes (O(n))
- **Barato**: No requiere operaciones costosas
- **ROT13**: Usa desplazamiento de 13 posiciones (mitad del alfabeto)
- **Encripta**: Letras (a-z, A-Z) y números (0-9)

## 💡 Ventajas

1. **Bajo costo computacional**: Operaciones simples de aritmética
2. **Sin dependencias externas**: Implementación pura JavaScript
3. **Protección básica**: Oculta los datos durante la transmisión
4. **Reversible**: Fácil de desencriptar con la clave correcta

## ⚠️ Limitaciones

1. **Seguridad básica**: El cifrado César es fácil de romper (solo 26 posibles claves)
2. **No criptográficamente seguro**: Solo para demostración/prototipo
3. **Clave fija**: Usa ROT13 (desplazamiento de 13)

## 🔄 Cómo Funciona

### Ejemplo de Encriptación

```javascript
// Orden original
const orderData = {
    amount: "500",
    tokenIn: "UNI",
    tokenOut: "USDC",
    duration: "48"
};

// Encriptar
const encrypted = encryptOrder(orderData, 13);
// Resultado: texto encriptado con caracteres rotados

// Desencriptar
const decrypted = decryptOrder(encrypted, 13);
// Resultado: orden original restaurada
```

### ROT13 en Acción

```
Original:  "UNI"
Encriptado: "HAV" (U→H, N→A, I→V)

Original:  "500"
Encriptado: "633" (5→6, 0→3, 0→3)
```

## 📝 Notas Técnicas

1. **Separación de concerns**:
   - La firma criptográfica se hace sobre el mensaje **sin encriptar**
   - Solo los datos de la orden se encriptan
   - Esto permite verificar la autenticidad sin afectar la encriptación

2. **Mensaje vs Orden**:
   - `messageToVerify`: Mensaje JSON firmado (sin encriptar, para verificación)
   - `encryptedOrder`: Orden encriptada con cifrado César (para procesamiento privado)

3. **Seguridad**:
   - El cifrado César es **NO seguro** para producción
   - Es útil para demostrar el concepto de encriptación
   - Para producción, usar AES o métodos criptográficos seguros

## 🚀 Uso

El sistema funciona automáticamente:
1. Usuario completa el formulario
2. Usuario firma con su wallet
3. La orden se encripta automáticamente
4. El backend desencripta y procesa

No se requiere acción adicional del usuario.

## 🔐 Futuras Mejoras

1. **Clave dinámica**: Generar claves por sesión
2. **Métodos más seguros**: Implementar AES-256
3. **Encriptación asimétrica**: Usar claves públicas/privadas
4. **Firmas encriptadas**: Firmar el mensaje encriptado directamente

