# 🔄 Guía de Migración - Anti-MEV Dark Pool

## 📋 Cómo Migrar del Código Antiguo al Refactorizado

### Opción 1: Migración Completa (Recomendada)

#### Paso 1: Backup del Código Actual

```powershell
# Crear una rama de backup
git checkout -b backup-original
git add .
git commit -m "Backup antes de refactorización"
git checkout main
```

#### Paso 2: Instalar Nuevas Dependencias

```powershell
# Backend - Agregar dotenv
npm install dotenv

# Frontend - Las dependencias ya están
cd Etherium-hackathon-main\frontend
npm install
cd ..\..
```

#### Paso 3: Configurar Variables de Entorno

```powershell
# Copiar el archivo de ejemplo
Copy-Item .env.example .env

# Editar según tus necesidades
notepad .env
```

Contenido mínimo del `.env`:
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

#### Paso 4: Actualizar Scripts de Inicio

En `package.json`, asegúrate de tener:
```json
{
  "scripts": {
    "start": "node server.refactored.js",
    "dev": "nodemon server.refactored.js",
    "start:old": "node server.js"
  }
}
```

#### Paso 5: Modificar el Frontend

Actualiza `Etherium-hackathon-main/frontend/src/App.js`:

```javascript
/**
 * @fileoverview Componente raíz de la aplicación
 */
import React from 'react';
import './App.css';
import { AntiMevApp } from './components/AntiMevApp';

function App() {
  return (
    <div className="App">
      <AntiMevApp />
    </div>
  );
}

export default App;
```

#### Paso 6: Probar la Aplicación

```powershell
# Terminal 1 - Backend refactorizado
npm start

# Terminal 2 - Frontend
cd Etherium-hackathon-main\frontend
npm start
```

Abre http://localhost:3000 y verifica que todo funcione.

### Opción 2: Migración Gradual

Si prefieres migrar poco a poco:

#### Fase 1: Probar Backend Refactorizado con Frontend Original

```powershell
# Usa el backend nuevo
npm start

# Frontend antiguo (sin cambios en App.js)
cd Etherium-hackathon-main\frontend
npm start
```

El backend refactorizado es **100% compatible** con el frontend antiguo porque usa los mismos endpoints.

#### Fase 2: Migrar Componentes del Frontend Uno por Uno

1. Empieza con componentes simples (Header, StatusMessage)
2. Luego componentes medios (OrderFormFields, SidePanel)
3. Finalmente componentes complejos (AntiMevApp, ResultsPanel)

#### Fase 3: Migrar Hooks y Servicios

1. Implementa `useWallet` hook
2. Implementa `useOrderForm` hook
3. Implementa servicios (wallet.service, api.service)

### Opción 3: Ejecutar Ambas Versiones Simultáneamente

Para comparar y validar:

#### Backend en Puertos Diferentes

```powershell
# Terminal 1 - Backend antiguo (puerto 3001)
node server.js

# Terminal 2 - Backend refactorizado (puerto 3002)
# Edita .env: PORT=3002
node server.refactored.js
```

#### Frontend Apuntando a Diferentes Backends

Edita `frontend/src/config/api.config.js`:

```javascript
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
```

Cambia el puerto para probar diferentes backends.

## ⚠️ Puntos de Atención

### Cambios que Pueden Requerir Ajustes

1. **Importaciones en el Frontend**
   ```javascript
   // Antiguo
   import OrderForm from './OrderForm';
   
   // Nuevo
   import { AntiMevApp } from './components/AntiMevApp';
   ```

2. **Uso de Servicios**
   ```javascript
   // Antiguo
   const provider = new ethers.BrowserProvider(window.ethereum);
   
   // Nuevo
   import walletService from '../services/wallet.service';
   const provider = await walletService.getProvider();
   ```

3. **Configuraciones**
   ```javascript
   // Antiguo (hardcoded)
   const API_URL = 'http://localhost:3001/api/orden';
   
   // Nuevo (centralizado)
   import { API_BASE_URL, API_ENDPOINTS } from '../config/api.config';
   ```

### Compatibilidad Garantizada

✅ **API Endpoints** - Sin cambios  
✅ **Formato de Datos** - Exactamente igual  
✅ **Flujo de Usuario** - Idéntico  
✅ **UI/UX** - Sin cambios visuales  

## 🧪 Checklist de Validación

Antes de considerar la migración completa, verifica:

### Backend
- [ ] El servidor inicia sin errores
- [ ] GET `/` retorna información del servidor
- [ ] GET `/api/health` retorna status 200
- [ ] POST `/api/orden` procesa órdenes correctamente
- [ ] Los logs se muestran en consola
- [ ] Las validaciones rechazan datos inválidos

### Frontend
- [ ] La aplicación se renderiza sin errores
- [ ] Se puede conectar la wallet
- [ ] Se muestra el balance correcto
- [ ] Se puede crear una orden
- [ ] La firma de MetaMask funciona
- [ ] Los resultados se muestran correctamente
- [ ] El modo demo funciona

### Integración
- [ ] Frontend puede comunicarse con backend
- [ ] Las firmas se verifican correctamente
- [ ] El cifrado/descifrado funciona
- [ ] No hay errores CORS
- [ ] Los tiempos de respuesta son buenos

## 🔧 Solución de Problemas

### Error: "Cannot find module './components/AntiMevApp'"

**Causa**: Los nuevos componentes no fueron copiados.

**Solución**:
```powershell
# Verifica que existan los archivos
ls Etherium-hackathon-main\frontend\src\components\
```

Si no existen, los archivos están en el contexto de esta conversación. Créalos manualmente.

### Error: "dotenv is not defined"

**Causa**: No instalaste dotenv en el backend.

**Solución**:
```powershell
npm install dotenv
```

Y agrega al inicio de `server.refactored.js`:
```javascript
require('dotenv').config();
```

### Error: "PORT is already in use"

**Causa**: Ya hay algo corriendo en el puerto 3001 o 3000.

**Solución**:
```powershell
# Ver qué está usando el puerto
netstat -ano | findstr :3001

# Matar el proceso
taskkill /PID <PID> /F
```

O cambia el puerto en `.env`.

### Advertencia: "React Hook useEffect has a missing dependency"

**Causa**: ESLint detecta dependencias faltantes en hooks.

**Solución**: Agrega las dependencias faltantes o usa `// eslint-disable-next-line` si es intencional.

## 📚 Recursos Adicionales

- **README.md** - Documentación completa del proyecto
- **QUICKSTART.md** - Guía de inicio rápido
- **ARCHITECTURE.md** - Arquitectura detallada
- **REFACTORING_SUMMARY.md** - Resumen de cambios

## 💡 Consejos

1. **No elimines el código antiguo** hasta estar 100% seguro
2. **Haz commits frecuentes** durante la migración
3. **Prueba cada cambio** antes de continuar
4. **Usa git branches** para experimentar
5. **Lee la documentación** antes de hacer cambios

## 🎯 Resultado Esperado

Después de la migración exitosa:

```
✅ Código modular y mantenible
✅ Documentación completa con JSDoc
✅ Separación de responsabilidades
✅ Manejo robusto de errores
✅ Validaciones en todas las capas
✅ Fácil de extender y testear
✅ Listo para producción (con ajustes de seguridad)
```

---

**¿Necesitas ayuda?** Consulta los archivos de documentación o abre un issue en el repositorio.
