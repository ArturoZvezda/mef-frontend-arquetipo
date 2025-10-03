# Native Federation en Angular

**Versión:** 1.0.0
**Fecha:** 3 de Octubre, 2025

---

## 📋 ¿Qué es Native Federation?

**Native Federation** es una implementación de Module Federation para Angular que permite:
- Compartir código entre aplicaciones en tiempo de ejecución
- Cargar módulos remotos dinámicamente
- Crear arquitecturas de microfrontends
- Evitar duplicación de dependencias comunes

---

## 🏗️ Conceptos Clave

### 1. Host (Aplicación Principal)

La aplicación que **consume** componentes remotos.

**En nuestro proyecto:** `mef-frontend-arquetipo` (puerto 4200)

```javascript
// host/federation.config.js
module.exports = withNativeFederation({
  shared: {
    ...shareAll({
      singleton: true,           // Una sola instancia
      strictVersion: true,       // Verificar versiones
      requiredVersion: 'auto'    // Detectar automáticamente
    }),
  },
});
```

### 2. Remote (Microfrontend Remoto)

La aplicación que **expone** componentes para ser consumidos.

**En nuestro proyecto:** `mef-ui` (puerto 4202)

```javascript
// mef-ui/federation.config.js
module.exports = withNativeFederation({
  name: 'mef-ui',   // Nombre del remote

  exposes: {
    // Exportar componentes
    './Button': './projects/mef-ui/src/app/components/button/button.component.ts',
    './Alert': './projects/mef-ui/src/app/components/alert/alert.component.ts',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  }
});
```

### 3. Federation Manifest

Archivo que mapea nombres de remotes a sus URLs.

```json
// host/public/federation.manifest.json
{
  "catalog": "http://localhost:4201/remoteEntry.json",
  "mef-ui": "http://localhost:4202/remoteEntry.json"
}
```

---

## 🔄 Flujo de Carga

```
1. Host inicia (puerto 4200)
   ↓
2. Lee federation.manifest.json
   ↓
3. Usuario navega a componente que usa MEF UI
   ↓
4. loadRemoteModule() ejecuta
   ↓
5. Descarga remoteEntry.json desde puerto 4202
   ↓
6. Verifica dependencias compartidas
   ↓
7. Descarga solo código único del remote
   ↓
8. Instancia componente remoto
   ↓
9. Componente se renderiza en host
```

---

## 📦 Shared Dependencies

### ¿Qué se Comparte?

```javascript
shared: {
  '@angular/core': { singleton: true },
  '@angular/common': { singleton: true },
  'rxjs': { singleton: true },
  // ... más dependencias
}
```

### Estrategias

| Opción | Descripción | Cuándo Usar |
|--------|-------------|-------------|
| `singleton: true` | Solo una instancia | Angular, RxJS (SIEMPRE) |
| `strictVersion: true` | Versiones deben coincidir | Producción |
| `requiredVersion: 'auto'` | Detecta de package.json | Desarrollo |

---

## 💻 Uso en Código

### Cargar Componente Remoto

```typescript
import { loadRemoteModule } from '@angular-architects/native-federation';

// Cargar componente
const module = await loadRemoteModule({
  remoteName: 'mef-ui',        // Nombre del remote
  exposedModule: './Button'    // Módulo expuesto
});

// Usar componente
const ButtonComponent = module.ButtonComponent;
```

### Con nuestro MefUiLoaderService

```typescript
@Injectable({ providedIn: 'root' })
export class MefUiLoaderService {
  async loadButton() {
    return await loadRemoteModule({
      remoteName: 'mef-ui',
      exposedModule: './Button'
    });
  }
}
```

---

## ⚙️ Configuración Técnica

### 1. main.ts con Federation

```typescript
import { initFederation } from '@angular-architects/native-federation';

initFederation()
  .catch(err => console.error(err))
  .then(_ => import('./bootstrap'))
  .catch(err => console.error(err));
```

### 2. bootstrap.ts (Aplicación Real)

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));
```

---

## 🎯 Ventajas

1. **Deployment Independiente**
   - Actualiza mef-ui sin rebuil

dear host

2. **Reducción de Tamaño**
   - Dependencias compartidas cargadas una vez

3. **Lazy Loading**
   - Componentes se cargan solo cuando se necesitan

4. **Versionado Flexible**
   - Diferentes versiones pueden coexistir

---

## ⚠️ Consideraciones

### Versiones Compatibles

```
Angular 18 ← Federation 18.x
Angular 19 ← Federation 19.x
Angular 20 ← Federation 20.x  ✅ (nuestro caso)
```

### CORS en Producción

```typescript
// Servidor debe permitir CORS
Access-Control-Allow-Origin: https://tu-dominio.com
```

---

## 📚 Recursos

- [Native Federation GitHub](https://github.com/angular-architects/native-federation)
- [Documentación Oficial](https://www.angulararchitects.io/en/blog/micro-frontends-with-modern-angular-part-1-standalone-and-esbuild/)

---

**Última actualización:** 3 de Octubre, 2025
