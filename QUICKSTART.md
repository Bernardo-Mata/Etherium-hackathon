# Guía de Inicio Rápido - Anti-MEV Dark Pool

## 🚀 Inicio Rápido (5 minutos)

### 1. Instalar Dependencias

```powershell
# Backend
npm install

# Frontend
cd Etherium-hackathon-main\frontend
npm install
cd ..\..
```

### 2. Configurar Variables de Entorno

```powershell
# Copiar el archivo de ejemplo
Copy-Item .env.example .env

# Editar el archivo .env si es necesario
notepad .env
```

### 3. Ejecutar la Aplicación

#### Opción A: Dos terminales separadas

**Terminal 1 - Backend:**
```powershell
node server.refactored.js
```

**Terminal 2 - Frontend:**
```powershell
cd Etherium-hackathon-main\frontend
npm start
```

#### Opción B: Con nodemon (desarrollo)

**Terminal 1 - Backend:**
```powershell
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd Etherium-hackathon-main\frontend
npm start
```

### 4. Abrir en el Navegador

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

### 5. Conectar MetaMask

1. Instala MetaMask: https://metamask.io
2. Crea o importa una wallet
3. Cambia a Ethereum Mainnet
4. Haz clic en "Conectar Billetera" en la app

### 6. Probar en Modo Demo

1. Activa el toggle "🎮 Modo Demo"
2. Completa el formulario con cualquier valor
3. Haz clic en "Firmar Orden Demo"
4. Firma en MetaMask
5. ¡Visualiza los resultados!

## 🔧 Comandos Útiles

### Backend

```powershell
# Iniciar servidor
npm start

# Iniciar con auto-reload
npm run dev

# Usar el servidor antiguo
npm run start:old
```

### Frontend

```powershell
cd Etherium-hackathon-main\frontend

# Iniciar desarrollo
npm start

# Build para producción
npm run build

# Ejecutar tests
npm test
```

### Smart Contracts

```powershell
# Compilar contratos
npx hardhat compile

# Ejecutar tests
npx hardhat test

# Desplegar localmente
npx hardhat node
npx hardhat run scripts\deploy.js --network localhost

# Desplegar en Scroll Sepolia
npx hardhat run scripts\deploy.js --network scrollSepolia
```

## 📝 Estructura del Proyecto

```
EtheriumMTY/
├── src/                    # Backend refactorizado
│   ├── config/            # Configuraciones
│   ├── controllers/       # Controladores
│   ├── services/          # Servicios
│   ├── middlewares/       # Middlewares
│   ├── routes/            # Rutas
│   └── utils/             # Utilidades
├── Etherium-hackathon-main/frontend/  # Frontend React
│   └── src/
│       ├── components/    # Componentes
│       ├── hooks/         # Custom hooks
│       ├── services/      # Servicios API
│       ├── config/        # Configuraciones
│       ├── constants/     # Constantes
│       └── utils/         # Utilidades
├── contracts/             # Smart contracts
├── scripts/               # Scripts de deployment
└── server.refactored.js   # Servidor principal
```

## ⚠️ Problemas Comunes

### Error: "MetaMask no está instalado"

**Solución**: Instala MetaMask desde https://metamask.io

### Error: "Red incorrecta"

**Solución**: En MetaMask, cambia a Ethereum Mainnet (Chain ID: 1)

### Error: "Saldo insuficiente"

**Solución**: Activa el Modo Demo o agrega ETH a tu wallet

### Error: Puerto 3000 o 3001 en uso

**Solución**:
```powershell
# Ver procesos usando el puerto
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Matar el proceso (reemplaza PID con el ID del proceso)
taskkill /PID <PID> /F
```

### Error: "Module not found"

**Solución**:
```powershell
# Limpia y reinstala dependencias
Remove-Item -Recurse -Force node_modules
npm install
```

## 🎯 Siguientes Pasos

1. ✅ Lee el README.md completo
2. ✅ Explora el código refactorizado
3. ✅ Prueba diferentes órdenes
4. ✅ Experimenta con el smart contract
5. ✅ Personaliza la UI según tus necesidades

## 💡 Tips

- Usa **Modo Demo** para probar sin gastar ETH
- Revisa la consola del navegador para logs detallados
- Revisa la consola del backend para ver el flujo de datos
- Los archivos `.js` ahora usan JSDoc para mejor documentación

## 📚 Recursos

- [Documentación de ethers.js](https://docs.ethers.org/)
- [Documentación de React](https://react.dev/)
- [Documentación de Hardhat](https://hardhat.org/)
- [MetaMask Documentation](https://docs.metamask.io/)

---

¿Necesitas ayuda? Abre un issue en el repositorio.
