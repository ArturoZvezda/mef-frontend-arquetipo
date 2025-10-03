# Guía de Integración MEF UI en Arquetipo Frontend

**Versión:** 1.0.0
**Fecha:** 3 de Octubre, 2025
**Autor:** Equipo de Desarrollo MEF

---

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Arquitectura General](#arquitectura-general)
3. [Componentes del Sistema](#componentes-del-sistema)
4. [Proceso de Integración](#proceso-de-integración)
5. [Configuración Paso a Paso](#configuración-paso-a-paso)
6. [Uso de Componentes](#uso-de-componentes)
7. [Resolución de Problemas](#resolución-de-problemas)
8. [Mejores Prácticas](#mejores-prácticas)

---

## 📖 Introducción

Esta guía documenta el proceso de integración del **Sistema de Diseño MEF UI** dentro del **Arquetipo Frontend MEF** utilizando **Native Federation** y siguiendo los principios de **Arquitectura Hexagonal**.

### ¿Qué logramos?

- ✅ Integración de 17+ componentes UI de diseño MEF
- ✅ Arquitectura desacoplada mediante microfrontends
- ✅ Compatibilidad entre Angular 20 en ambos proyectos
- ✅ Patrón de wrapper para mantener arquitectura hexagonal
- ✅ Carga dinámica de componentes remotos

### Proyectos Involucrados

1. **mef-design-system** (Puerto 4202)
   - Sistema de diseño con componentes UI reutilizables
   - Expone componentes via Native Federation
   - Angular 20 + TypeScript

2. **mef-frontend-arquetipo** (Puerto 4200)
   - Aplicación host con arquitectura hexagonal
   - Consume componentes remotos del design system
   - Nx Monorepo + Angular 20

---

## 🏗️ Arquitectura General

### Diagrama de Integración

```
┌─────────────────────────────────────────────────────────────┐
│         NAVEGADOR (http://localhost:4200)                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  CAPA DE PRESENTACIÓN                                 │ │
│  │  host/src/app/components/mef-ui-demo                  │ │
│  │  - Muestra componentes integrados                     │ │
│  │  - Maneja eventos de usuario                          │ │
│  └────────────────────┬──────────────────────────────────┘ │
│                       │ importa                            │
│  ┌───────────────────▼──────────────────────────────────┐ │
│  │  CAPA UI (Wrapper Pattern)                           │ │
│  │  ui/src/lib/components/                              │ │
│  │  - MefButtonWrapperComponent                         │ │
│  │  - MefAlertWrapperComponent                          │ │
│  │  - MefTextFieldWrapperComponent                      │ │
│  └────────────────────┬──────────────────────────────────┘ │
│                       │ usa                                │
│  ┌───────────────────▼──────────────────────────────────┐ │
│  │  CAPA COMPARTIDA (Servicios)                         │ │
│  │  shared/src/lib/services/                            │ │
│  │  - MefUiLoaderService                                │ │
│  │  - Carga componentes remotos dinámicamente           │ │
│  └────────────────────┬──────────────────────────────────┘ │
│                       │ loadRemoteModule()                 │
└───────────────────────┼────────────────────────────────────┘
                        │ HTTP Request
                        ▼
┌─────────────────────────────────────────────────────────────┐
│    MICROFRONTEND REMOTO (http://localhost:4202)            │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐ │
│  │  MEF UI DESIGN SYSTEM                                 │ │
│  │  projects/mef-ui/src/app/components/                  │ │
│  │                                                        │ │
│  │  Expone via federation.config.js:                     │ │
│  │  - ./Button → ButtonComponent                         │ │
│  │  - ./Alert → AlertComponent                           │ │
│  │  - ./TextField → TextFieldComponent                   │ │
│  │  - ... 14 componentes más                             │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  remoteEntry.json disponible en:                           │
│  http://localhost:4202/remoteEntry.json                    │
└─────────────────────────────────────────────────────────────┘
```

### Flujo de Carga de Componentes

```
1. Usuario navega a /mef-ui-demo
   ↓
2. MefUiDemoComponent se renderiza
   ↓
3. Importa MefButtonWrapperComponent
   ↓
4. Wrapper llama a MefUiLoaderService.loadButton()
   ↓
5. Servicio ejecuta loadRemoteModule()
   ↓
6. Native Federation descarga componente desde puerto 4202
   ↓
7. Componente remoto se instancia dinámicamente
   ↓
8. Wrapper pasa inputs y escucha outputs
   ↓
9. Componente se renderiza en el DOM
```

---

## 🔧 Componentes del Sistema

### 1. MEF UI Design System (Remoto)

**Ubicación:** `C:\dev\integracion\mef-design-system-master`

**Responsabilidades:**
- Proporcionar componentes UI reutilizables
- Exponer componentes via Native Federation
- Mantener estilos y fuentes Material Icons

**Configuración Clave:**

```javascript
// projects/mef-ui/federation.config.js
module.exports = withNativeFederation({
  name: 'mef-ui',
  exposes: {
    './Button': './projects/mef-ui/src/app/components/button/button.component.ts',
    './Alert': './projects/mef-ui/src/app/components/alert/alert.component.ts',
    './TextField': './projects/mef-ui/src/app/components/text-field/text-field.component.ts',
    // ... más componentes
  },
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  }
});
```

**Puerto:** 4202
**URL Remota:** http://localhost:4202/remoteEntry.json

### 2. MefUiLoaderService (Servicio de Carga)

**Ubicación:** `shared/src/lib/services/mef-ui-loader.service.ts`

**Responsabilidades:**
- Cargar componentes remotos dinámicamente
- Abstraer la lógica de Native Federation
- Proporcionar métodos tipados para cada componente

**Ejemplo de Uso:**

```typescript
@Injectable({ providedIn: 'root' })
export class MefUiLoaderService {
  private readonly remoteName = 'mef-ui';

  async loadButton() {
    return await loadRemoteModule({
      remoteName: this.remoteName,
      exposedModule: './Button'
    });
  }

  async loadAlert() {
    return await loadRemoteModule({
      remoteName: this.remoteName,
      exposedModule: './Alert'
    });
  }
  // ... más métodos
}
```

### 3. Componentes Wrapper (Adaptadores)

**Ubicación:** `ui/src/lib/components/`

**Responsabilidades:**
- Adaptar componentes remotos a la arquitectura hexagonal
- Proporcionar interfaz consistente
- Manejar carga asíncrona de componentes

**Ejemplo: MefButtonWrapperComponent**

```typescript
@Component({
  selector: 'mef-button-wrapper',
  standalone: true,
  template: `<div #container></div>`
})
export class MefButtonWrapperComponent implements OnInit {
  @ViewChild('container', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;

  @Input() variant: 'filled' | 'outlined' | 'text' = 'filled';
  @Input() textButton: string = 'Button';
  @Output() onClick = new EventEmitter<void>();

  constructor(private mefUiLoader: MefUiLoaderService) {}

  async ngOnInit() {
    const ButtonComponent = await this.mefUiLoader.loadButton();
    const componentRef = this.container.createComponent(ButtonComponent.ButtonComponent);

    // Mapear inputs
    componentRef.instance.variant = this.variant;
    componentRef.instance.textButton = this.textButton;

    // Suscribirse a outputs
    if (componentRef.instance.onClick) {
      componentRef.instance.onClick.subscribe(() => this.onClick.emit());
    }
  }
}
```

---

## 🚀 Proceso de Integración

### Fase 1: Alineación de Versiones

**Problema Inicial:** Angular 18 vs Angular 20

**Solución Implementada:**

1. Actualizar `mef-design-system/package.json`:
   ```json
   {
     "dependencies": {
       "@angular/core": "~20.1.0",
       "@angular/common": "~20.1.0",
       // ... todos los paquetes Angular a 20.1.0
     },
     "devDependencies": {
       "@angular-architects/native-federation": "^20.1.6",
       "typescript": "~5.8.2"
     }
   }
   ```

2. Ejecutar instalación:
   ```bash
   cd C:\dev\integracion\mef-design-system-master
   npm install --legacy-peer-deps
   ```

3. Verificar build:
   ```bash
   npm run ng -- build mef-ui
   ```

### Fase 2: Configuración de Puertos

**Conflicto:** catalog y mef-ui ambos en puerto 4201

**Solución:**

1. Cambiar puerto de mef-ui a 4202:
   ```json
   // angular.json
   {
     "projects": {
       "mef-ui": {
         "architect": {
           "serve": {
             "options": {
               "port": 4202
             }
           }
         }
       }
     }
   }
   ```

2. Asignación final de puertos:
   - Host: 4200
   - Catalog: 4201
   - MEF UI: 4202

### Fase 3: Configuración de Federation Manifest

**Archivo:** `host/public/federation.manifest.json`

```json
{
  "catalog": "http://localhost:4201/remoteEntry.json",
  "mef-ui": "http://localhost:4202/remoteEntry.json"
}
```

Esta configuración le indica al host dónde encontrar cada microfrontend remoto.

### Fase 4: Creación de Servicios y Wrappers

**Servicios Creados:**
- `MefUiLoaderService` - Carga componentes remotos

**Wrappers Creados:**
- `MefButtonWrapperComponent`
- `MefAlertWrapperComponent`
- `MefTextFieldWrapperComponent`

**Exportados desde:**
- `@mef-frontend-arquetipo/shared` (servicio)
- `@mef-frontend-arquetipo/ui` (wrappers)

### Fase 5: Configuración de Estilos

**Problema:** Componentes sin estilos ni iconos

**Solución en `host/src/index.html`:**

```html
<!-- Material Icons (4 variantes) -->
<link href="https://fonts.googleapis.com/css2?family=Material+Icons" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Icons+Outlined" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Icons+Round" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Icons+Sharp" rel="stylesheet">

<!-- Estilos de MEF UI -->
<link rel="stylesheet" href="http://localhost:4202/styles.css">
```

### Fase 6: Creación de Demo

**Componente:** `MefUiDemoComponent`
**Ruta:** `/mef-ui-demo`
**Propósito:** Demostrar integración funcional

---

## 📝 Configuración Paso a Paso

### Paso 1: Iniciar MEF UI Design System

```bash
# Terminal 1
cd C:\dev\integracion\mef-design-system-master
npm run ng -- serve mef-ui

# Esperar mensaje:
# ✔ Building...
# ➜  Local:   http://localhost:4202/
```

### Paso 2: Construir Librerías del Arquetipo

```bash
# Terminal 2
cd C:\dev\integracion\mef-frontend-arquetipo

# Construir librería shared (contiene MefUiLoaderService)
npx nx build shared

# La librería ui no necesita build (se compila con el host)
```

### Paso 3: Iniciar Aplicación Host

```bash
# Mismo terminal 2
npx nx serve host

# Esperar mensaje:
# ✔ Building...
# ➜  Local:   http://localhost:4200/
```

### Paso 4: Verificar Integración

1. Abrir navegador: http://localhost:4200/mef-ui-demo
2. Verificar que se muestran:
   - ✅ Botones con estilos correctos
   - ✅ Iconos Material Icons
   - ✅ Alerts con colores apropiados
   - ✅ TextFields funcionales

---

## 💻 Uso de Componentes

### Opción 1: Uso Directo de Wrappers (Recomendado)

```typescript
// En tu componente
import { Component } from '@angular/core';
import { MefButtonWrapperComponent } from '@mef-frontend-arquetipo/ui';

@Component({
  selector: 'app-mi-pagina',
  standalone: true,
  imports: [MefButtonWrapperComponent],
  template: `
    <h1>Mi Página</h1>
    <mef-button-wrapper
      variant="filled"
      textButton="Guardar"
      (onClick)="guardar()">
    </mef-button-wrapper>
  `
})
export class MiPaginaComponent {
  guardar() {
    console.log('Guardando...');
  }
}
```

### Opción 2: Crear Nuevos Wrappers

Para componentes que aún no tienen wrapper:

```typescript
// ui/src/lib/components/mef-checkbox-wrapper.component.ts
import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MefUiLoaderService } from '@mef-frontend-arquetipo/shared';

@Component({
  selector: 'mef-checkbox-wrapper',
  standalone: true,
  template: `<div #container></div>`
})
export class MefCheckboxWrapperComponent implements OnInit {
  @ViewChild('container', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;

  @Input() checked: boolean = false;
  @Input() label: string = '';
  @Output() checkedChange = new EventEmitter<boolean>();

  constructor(private mefUiLoader: MefUiLoaderService) {}

  async ngOnInit() {
    const CheckboxComponent = await this.mefUiLoader.loadCheckbox();
    const componentRef = this.container.createComponent(CheckboxComponent.CheckboxLabelComponent);

    componentRef.instance.checked = this.checked;
    componentRef.instance.label = this.label;

    if (componentRef.instance.checkedChange) {
      componentRef.instance.checkedChange.subscribe((value: boolean) => {
        this.checkedChange.emit(value);
      });
    }
  }
}
```

No olvides exportar:

```typescript
// ui/src/index.ts
export * from './lib/components/mef-checkbox-wrapper.component';
```

---

## 🐛 Resolución de Problemas

### Problema: "Cannot find module '@mef-frontend-arquetipo/shared'"

**Causa:** La librería shared no está construida.

**Solución:**
```bash
npx nx build shared
```

### Problema: Componentes sin estilos

**Causa:** Material Icons o estilos de mef-ui no cargados.

**Verificar:**
1. Inspeccionar `host/src/index.html`
2. Confirmar que existen los 4 links de Material Icons
3. Confirmar link a `http://localhost:4202/styles.css`
4. Verificar que mef-ui esté ejecutándose en puerto 4202

### Problema: "Error loading remote module"

**Causa:** mef-ui no está ejecutándose o puerto incorrecto.

**Solución:**
1. Verificar que mef-ui corra en puerto 4202
2. Verificar `federation.manifest.json` apunta a URL correcta
3. Abrir http://localhost:4202/remoteEntry.json en navegador (debe mostrar JSON)

### Problema: Componente carga pero no responde a eventos

**Causa:** Outputs no están correctamente suscritos en wrapper.

**Solución:**
```typescript
// Verificar en wrapper
if (componentRef.instance.onClick) {
  componentRef.instance.onClick.subscribe(() => {
    this.onClick.emit(); // Asegurar que se emite
  });
}
```

---

## ✅ Mejores Prácticas

### 1. Siempre Usar Wrappers

❌ **Incorrecto:**
```typescript
// No cargar componentes remotos directamente
const ButtonComponent = await loadRemoteModule({...});
```

✅ **Correcto:**
```typescript
// Usar wrapper components
import { MefButtonWrapperComponent } from '@mef-frontend-arquetipo/ui';
```

**Razón:** Los wrappers mantienen la arquitectura hexagonal y facilitan testing.

### 2. Mantener Naming Consistente

**Patrón de nombres:**
- Servicio: `MefUiLoaderService`
- Wrapper: `Mef[Componente]WrapperComponent`
- Método loader: `load[Componente]()`

### 3. Documentar Inputs y Outputs

```typescript
/**
 * Wrapper para el componente Button de MEF UI
 *
 * @Input variant - Estilo del botón: 'filled' | 'outlined' | 'text'
 * @Input textButton - Texto a mostrar en el botón
 * @Input disabled - Si el botón está deshabilitado
 * @Output onClick - Evento cuando se hace clic
 */
@Component({...})
export class MefButtonWrapperComponent {
  @Input() variant: 'filled' | 'outlined' | 'text' = 'filled';
  @Input() textButton: string = 'Button';
  @Input() disabled: boolean = false;
  @Output() onClick = new EventEmitter<void>();
}
```

### 4. Manejo de Errores

```typescript
async ngOnInit() {
  try {
    const Component = await this.mefUiLoader.loadButton();
    this.componentRef = this.container.createComponent(Component.ButtonComponent);
    // ... configuración
  } catch (error) {
    console.error('Error cargando componente MEF UI:', error);
    // Opcionalmente mostrar componente fallback
  }
}
```

### 5. Testing

Para testing de wrappers, mockear el MefUiLoaderService:

```typescript
describe('MefButtonWrapperComponent', () => {
  let mockLoader: jasmine.SpyObj<MefUiLoaderService>;

  beforeEach(() => {
    mockLoader = jasmine.createSpyObj('MefUiLoaderService', ['loadButton']);

    TestBed.configureTestingModule({
      providers: [
        { provide: MefUiLoaderService, useValue: mockLoader }
      ]
    });
  });

  it('should load button component', async () => {
    const mockComponent = { ButtonComponent: MockButtonComponent };
    mockLoader.loadButton.and.returnValue(Promise.resolve(mockComponent));

    const fixture = TestBed.createComponent(MefButtonWrapperComponent);
    await fixture.whenStable();

    expect(mockLoader.loadButton).toHaveBeenCalled();
  });
});
```

---

## 📚 Recursos Adicionales

- [Arquitectura Hexagonal](./02-ARQUITECTURA-HEXAGONAL.md)
- [Native Federation](./03-NATIVE-FEDERATION.md)
- [Patrón Wrapper](./04-PATRON-WRAPPER.md)
- [Troubleshooting Avanzado](./05-TROUBLESHOOTING.md)
- [Workflow de Desarrollo](./06-WORKFLOW-DESARROLLO.md)

---

## 📞 Soporte

Para preguntas o problemas:
1. Revisar esta documentación
2. Consultar los logs en consola del navegador
3. Verificar que ambos servidores estén ejecutándose
4. Contactar al equipo de arquitectura

---

**Última actualización:** 3 de Octubre, 2025
**Versión del documento:** 1.0.0
