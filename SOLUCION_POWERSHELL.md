# Solución para Error de PowerShell con npm

## Problema
```
npm : No se puede cargar el archivo C:\Program Files\nodejs\npm.ps1 porque la ejecución de scripts está deshabilitada en este sistema.
```

## Soluciones

### ✅ Solución 1: Usar `npm.cmd` (Más Simple)

En PowerShell, usa `npm.cmd` en lugar de `npm`:

```powershell
npm.cmd install
npm.cmd run compile
npm.cmd start
npm.cmd run deploy:scroll-sepolia
```

### ✅ Solución 2: Usar CMD (Command Prompt)

Abre **CMD** en lugar de PowerShell y usa los comandos normales:

```cmd
npm install
npm run compile
npm start
```

### ✅ Solución 3: Crear Alias en PowerShell (Solo para la sesión actual)

En PowerShell, ejecuta:
```powershell
Set-Alias -Name npm -Value npm.cmd
```

Esto solo funciona para la sesión actual. Si quieres hacerlo permanente, agrega la línea anterior a tu perfil de PowerShell.

### ⚠️ Solución 4: Cambiar Política de Ejecución (Requiere Administrador)

Si tienes permisos de administrador, puedes cambiar la política:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Nota:** Esto puede no funcionar si hay políticas de grupo que lo bloqueen.

## Recomendación

Usa la **Solución 1** (`npm.cmd`) - es la más simple y funciona siempre.

