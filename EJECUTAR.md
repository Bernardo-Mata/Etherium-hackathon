# Cómo Ejecutar la Aplicación Anti-MEV

## Prerequisitos
- Node.js instalado
- Dependencias instaladas (`npm install` en cada directorio)

## Pasos para Ejecutar

### Opción 1: Ejecutar en Terminales Separadas (Recomendado)

#### Terminal 1 - Backend
```powershell
# Desde la raíz del proyecto
npm.cmd start
```
El backend correrá en: `http://localhost:3001`

#### Terminal 2 - Frontend
```powershell
# Navegar al directorio del frontend
cd Etherium-hackathon-main/frontend

# Instalar dependencias (si no lo has hecho)
npm.cmd install

# Iniciar el frontend
npm.cmd start
```
El frontend se abrirá automáticamente en: `http://localhost:3000`

### Opción 2: Usar CMD en lugar de PowerShell

Si prefieres usar CMD (Command Prompt), simplemente usa `npm` en lugar de `npm.cmd`:

#### CMD - Backend
```cmd
npm start
```

#### CMD - Frontend
```cmd
cd Etherium-hackathon-main\frontend
npm start
```

## Notas Importantes

1. **El backend debe estar corriendo** antes de usar el frontend, ya que el frontend hace peticiones a `http://localhost:3001`.

2. **Proxy configurado**: El frontend tiene configurado un proxy a `http://localhost:3001` en su `package.json`, así que las peticiones al backend se hacen automáticamente.

3. **Puertos**:
   - Backend: Puerto 3001
   - Frontend: Puerto 3000

4. **Si el frontend no se abre automáticamente**, navega manualmente a `http://localhost:3000` en tu navegador.

## Solución de Problemas

### Error: "EADDRINUSE" (puerto en uso)
- Asegúrate de que no hay otra instancia corriendo
- Puedes cambiar el puerto en `server.js` (backend) o `.env` (frontend)

### Error: "npm no se reconoce"
- Usa `npm.cmd` en PowerShell o abre CMD en su lugar

### Frontend no se conecta al backend
- Verifica que el backend esté corriendo en el puerto 3001
- Revisa la consola del navegador para ver errores específicos

