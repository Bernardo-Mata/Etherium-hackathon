# Anti-MEV Dark Pool - Frontend

Frontend de React para la aplicación Dark Pool Anti-MEV desarrollada para el Ethereum Hackathon.

## 🚀 Características

- **Interfaz de usuario moderna**: Construida con React 19.2.0 y componentes funcionales
- **Integración con MetaMask**: Conexión directa con wallets de Ethereum
- **Visualización de TWAP**: Gráficos interactivos con Recharts
- **Modo Demo**: Prueba la aplicación sin necesidad de wallet
- **Arquitectura modular**: Separación clara de componentes, servicios y hooks

## 📁 Estructura del Proyecto

```
frontend/
├── public/              # Archivos estáticos
├── src/
│   ├── components/      # Componentes React
│   │   ├── AntiMevApp.jsx          # Componente principal
│   │   ├── Header.jsx              # Encabezado y navegación
│   │   ├── OrderFormFields.jsx     # Formulario de órdenes
│   │   ├── ResultsPanel.jsx        # Panel de resultados
│   │   ├── SidePanel.jsx           # Panel lateral
│   │   └── StatusMessage.jsx       # Mensajes de estado
│   ├── config/          # Configuraciones
│   │   ├── api.config.js           # URLs y endpoints
│   │   └── blockchain.config.js    # Redes blockchain
│   ├── constants/       # Constantes de la aplicación
│   ├── hooks/           # Custom hooks
│   │   ├── useWallet.js            # Gestión de wallet
│   │   └── useOrderForm.js         # Gestión de formulario
│   ├── services/        # Servicios
│   │   ├── api.service.js          # Comunicación con backend
│   │   └── wallet.service.js       # Interacción con blockchain
│   ├── styles/          # Estilos centralizados
│   ├── utils/           # Utilidades
│   │   ├── caesarCipher.js         # Encriptación Caesar
│   │   └── format.utils.js         # Funciones de formateo
│   ├── App.js           # Componente raíz
│   └── index.js         # Punto de entrada
└── package.json
```

## 🛠️ Tecnologías

- **React 19.2.0**: Framework principal
- **ethers.js 6.15.0**: Interacción con Ethereum
- **Recharts 3.3.0**: Visualización de datos
- **Create React App**: Configuración base

## 📦 Instalación

```bash
cd Etherium-hackathon-main/frontend
npm install
```

## ▶️ Ejecución

### Modo Desarrollo
```bash
npm start
```

La aplicación se abrirá en [http://localhost:3000](http://localhost:3000)

### Modo Producción
```bash
npm run build
npm install -g serve
serve -s build
```

## 🔧 Configuración

### Variables de Entorno
Puedes configurar las siguientes variables creando un archivo `.env` en la raíz del frontend:

```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_NETWORK=scroll
```

### Redes Soportadas
- Ethereum Mainnet (ID: 1)
- Scroll Mainnet (ID: 534352)
- Arbitrum One (ID: 42161)

## 🎯 Uso

1. **Conectar Wallet**: Haz clic en "Conectar MetaMask"
2. **Seleccionar Red**: Asegúrate de estar en una red soportada
3. **Ingresar Datos**: Completa el formulario de orden TWAP
4. **Ver Resultados**: Analiza las gráficas y comparativas de ejecución

### Modo Demo
Activa el "Modo Demo" para probar la aplicación sin conectar una wallet real.

## 📚 Componentes Principales

### AntiMevApp
Componente principal que orquesta toda la aplicación. Maneja el estado global y la lógica de negocio.

### Header
Encabezado con navegación y botón de conexión de wallet.

### OrderFormFields
Formulario para crear órdenes TWAP con validación en tiempo real.

### ResultsPanel
Visualización de resultados con gráficos de comparación entre ejecución ideal y con MEV.

## 🔐 Seguridad

- **Validación de inputs**: Todos los formularios validan datos antes de enviar
- **Firma de mensajes**: Uso de EIP-191 para firmas personales
- **Conexión segura**: Comunicación HTTPS con el backend
- **Encriptación**: Caesar cipher para demostración (usar AES-256 en producción)

## 🐛 Problemas Comunes

### MetaMask no se conecta
- Verifica que MetaMask esté instalado
- Actualiza MetaMask a la última versión
- Limpia caché del navegador

### Error de red
- Confirma que estés en una red soportada
- Verifica tu conexión a Internet
- Revisa que el backend esté ejecutándose

### Balance insuficiente
- Asegúrate de tener ETH en tu wallet
- Prueba el modo demo para testing

## 📖 Documentación Adicional

- [Guía Rápida](../../QUICKSTART.md)
- [Arquitectura](../../ARCHITECTURE.md)
- [Guía de Migración](../../MIGRATION_GUIDE.md)

## 🤝 Contribuir

Para contribuir al proyecto:
1. Lee la documentación de arquitectura
2. Sigue las convenciones de código
3. Documenta tus funciones con JSDoc
4. Prueba antes de hacer commit

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles

---

Desarrollado para el Ethereum Hackathon 🚀
