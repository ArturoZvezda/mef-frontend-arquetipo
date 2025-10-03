# Guía de Resolución de Problemas

**Versión:** 1.0.0
**Fecha:** 3 de Octubre, 2025

---

## 🔍 Diagnóstico General

### Checklist Rápido

Antes de investigar problemas específicos, verificar:

- [ ] ✅ mef-ui corriendo en puerto 4202
- [ ] ✅ host corriendo en puerto 4200
- [ ] ✅ `federation.manifest.json` configurado correctamente
- [ ] ✅ Material Icons cargados en `index.html`
- [ ] ✅ Estilos de mef-ui cargados
- [ ] ✅ Consola del navegador sin errores

---

## 🐛 Problemas Comunes

### 1. "Cannot find module '@mef-frontend-arquetipo/shared'"

**Síntomas:**
```
Error: Cannot find module '@mef-frontend-arquetipo/shared'
```

**Causa:** Librería shared no está construida.

**Solución:**
```bash
cd C:\dev\integracion\mef-frontend-arquetipo
npx nx build shared
```

**Verificar:**
```bash
# Debe existir:
ls dist/shared
```

---

### 2. "Error loading remote module"

**Síntomas:**
```
ChunkLoadError: Loading chunk 'mef-ui' failed
```

**Causas Posibles:**

#### A) mef-ui no está ejecutándose

```bash
# Verificar que esté corriendo
# Terminal separado:
cd C:\dev\integracion\mef-design-system-master
npm run ng -- serve mef-ui

# Debe mostrar:
# ➜  Local:   http://localhost:4202/
```

#### B) Puerto incorrecto en manifest

```json
// Verificar host/public/federation.manifest.json
{
  "mef-ui": "http://localhost:4202/remoteEntry.json"  // ← Debe ser 4202
}
```

#### C) CORS bloqueado

**Verificar en consola:**
```
Access to fetch at 'http://localhost:4202/remoteEntry.json' blocked by CORS
```

**Solución (desarrollo):**
Los servidores de desarrollo Angular ya tienen CORS habilitado.

**Solución (producción):**
Configurar headers en servidor:
```
Access-Control-Allow-Origin: https://tu-dominio.com
```

---

### 3. Componentes Sin Estilos

**Síntomas:**
- Botones sin color
- Iconos no aparecen
- Layout roto

**Verificar en `host/src/index.html`:**

```html
<!-- ¿Están estas líneas presentes? -->
<link href="https://fonts.googleapis.com/css2?family=Material+Icons" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Icons+Outlined" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Icons+Round" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Icons+Sharp" rel="stylesheet">
<link rel="stylesheet" href="http://localhost:4202/styles.css">
```

**Verificar que mef-ui styles.css esté accesible:**
```bash
# En navegador abrir:
http://localhost:4202/styles.css

# Debe mostrar CSS, no error 404
```

---

### 4. "ExpressionChangedAfterItHasBeenCheckedError"

**Síntomas:**
```
Error: ExpressionChangedAfterItHasBeenCheckedError
```

**Causa:** Wrapper está modificando valores después de la detección de cambios.

**Solución:**
```typescript
async ngOnInit() {
  const Component = await this.mefUiLoader.loadButton();
  this.componentRef = this.container.createComponent(Component.ButtonComponent);

  // Envolver en setTimeout
  setTimeout(() => {
    this.componentRef!.instance.variant = this.variant;
    this.componentRef!.instance.textButton = this.textButton;
  });
}
```

O usar `ChangeDetectorRef`:
```typescript
constructor(
  private mefUiLoader: MefUiLoaderService,
  private cdr: ChangeDetectorRef
) {}

async ngOnInit() {
  // ... cargar componente
  this.componentRef.instance.variant = this.variant;
  this.cdr.detectChanges();
}
```

---

### 5. Evento no se Dispara

**Síntomas:**
```typescript
<mef-button-wrapper (onClick)="handleClick()"></mef-button-wrapper>
// handleClick() nunca se ejecuta
```

**Causa:** Output no está correctamente suscrito en wrapper.

**Verificar en wrapper:**
```typescript
async ngOnInit() {
  // ...
  // ¿Está esto presente?
  if (this.componentRef.instance.onClick) {
    this.componentRef.instance.onClick.subscribe(() => {
      this.onClick.emit();  // ← Debe emitir
    });
  }
}
```

**Debugging:**
```typescript
if (this.componentRef.instance.onClick) {
  this.componentRef.instance.onClick.subscribe(() => {
    console.log('Remote onClick triggered');  // ← Agregar log
    this.onClick.emit();
  });
} else {
  console.warn('Remote component has no onClick output');
}
```

---

### 6. Versiones Incompatibles

**Síntomas:**
```
Version mismatch: @angular/core requires ^18.0.0 but found 20.1.0
```

**Causa:** mef-ui y host tienen versiones diferentes de Angular.

**Solución:**
Actualizar mef-ui a Angular 20 (ya hecho en nuestra integración).

**Verificar versiones:**
```bash
# En mef-ui
cd C:\dev\integracion\mef-design-system-master
cat package.json | grep "@angular/core"

# En arquetipo
cd C:\dev\integracion\mef-frontend-arquetipo
cat package.json | grep "@angular/core"

# Deben coincidir: ~20.1.0
```

---

### 7. Puerto Ya en Uso

**Síntomas:**
```
Port 4202 is already in use
```

**Solución A: Matar proceso**
```bash
npx kill-port 4202
```

**Solución B: Cambiar puerto temporalmente**
```bash
npm run ng -- serve mef-ui --port 4203
```

---

### 8. Build Falla después de Cambios

**Síntomas:**
```
Error: Cannot find name 'MefButtonWrapperComponent'
```

**Causa:** Componente no exportado o cache corrupto.

**Solución:**
```bash
# Limpiar cache
npx nx reset

# Rebuild shared
npx nx build shared

# Reiniciar dev server
npx nx serve host
```

---

## 🔧 Herramientas de Debugging

### 1. Consola del Navegador

**Abrir DevTools:** F12

**Verificar:**
- **Console:** Errores de carga
- **Network:** Requests a remoteEntry.json
- **Elements:** Componentes renderizados

### 2. Angular DevTools

**Instalar:**
Chrome Web Store → "Angular DevTools"

**Usar:**
- Ver componentes cargados
- Inspeccionar inputs/outputs
- Profiler de performance

### 3. Verificar Remote Entry

```bash
# En navegador abrir:
http://localhost:4202/remoteEntry.json

# Debe mostrar JSON con estructura similar a:
{
  "name": "mef-ui",
  "shared": [...],
  "exposes": {
    "./Button": {...},
    "./Alert": {...}
  }
}
```

---

## 📋 Logs Útiles

### En MefUiLoaderService

```typescript
async loadButton() {
  console.log('🔄 Loading Button from mef-ui...');
  try {
    const module = await loadRemoteModule({
      remoteName: this.remoteName,
      exposedModule: './Button'
    });
    console.log('✅ Button loaded successfully', module);
    return module;
  } catch (error) {
    console.error('❌ Error loading Button:', error);
    throw error;
  }
}
```

### En Wrapper Component

```typescript
async ngOnInit() {
  console.log('🎨 Initializing wrapper...');
  try {
    const Component = await this.mefUiLoader.loadButton();
    console.log('✅ Component loaded:', Component);

    this.componentRef = this.container.createComponent(Component.ButtonComponent);
    console.log('✅ Component instantiated');

    // Mapear inputs
    console.log('📝 Mapping inputs:', {
      variant: this.variant,
      textButton: this.textButton
    });
  } catch (error) {
    console.error('❌ Wrapper init failed:', error);
  }
}
```

---

## 🆘 Cuando Todo Falla

### Reset Completo

```bash
# 1. Detener todos los servidores (Ctrl+C en terminales)

# 2. Limpiar node_modules (opcional pero efectivo)
cd C:\dev\integracion\mef-design-system-master
rm -rf node_modules
npm install --legacy-peer-deps

cd C:\dev\integracion\mef-frontend-arquetipo
rm -rf node_modules
npm install

# 3. Limpiar cache de Nx
cd C:\dev\integracion\mef-frontend-arquetipo
npx nx reset

# 4. Rebuild todo
npx nx build shared
npx nx build ui

# 5. Iniciar en orden
# Terminal 1:
cd C:\dev\integracion\mef-design-system-master
npm run ng -- serve mef-ui

# Terminal 2 (esperar a que termine Terminal 1):
cd C:\dev\integracion\mef-frontend-arquetipo
npx nx serve host
```

---

## 📞 Soporte

Si el problema persiste:
1. Revisar logs completos en consola
2. Verificar versiones de dependencias
3. Consultar documentación oficial de Native Federation
4. Contactar al equipo de arquitectura con:
   - Descripción del problema
   - Logs de error
   - Pasos para reproducir

---

**Última actualización:** 3 de Octubre, 2025
