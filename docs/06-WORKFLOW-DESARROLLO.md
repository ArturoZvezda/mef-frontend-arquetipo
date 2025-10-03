# Workflow de Desarrollo

**Versión:** 1.0.0
**Fecha:** 3 de Octubre, 2025

---

## 🚀 Inicio Diario

### Secuencia de Arranque

```bash
# Terminal 1: MEF UI Design System
cd C:\dev\integracion\mef-design-system-master
npm run ng -- serve mef-ui
# Esperar: ➜  Local:   http://localhost:4202/

# Terminal 2: Arquetipo Host
cd C:\dev\integracion\mef-frontend-arquetipo
npx nx serve host
# Esperar: ➜  Local:   http://localhost:4200/
```

**Tiempo estimado:** 30-60 segundos por servidor

---

## 📝 Tareas Comunes

### 1. Agregar Nuevo Wrapper

**Duración:** 15-20 minutos

```bash
# 1. Crear archivo
# ui/src/lib/components/mef-[componente]-wrapper.component.ts

# 2. Copiar template del patrón wrapper

# 3. Actualizar MefUiLoaderService
# shared/src/lib/services/mef-ui-loader.service.ts

# 4. Exportar wrapper
# ui/src/index.ts

# 5. Rebuild shared (si se modificó)
npx nx build shared

# 6. Hot reload detectará cambios en ui automáticamente
```

**Ejemplo: Agregar Checkbox**

```typescript
// 1. shared/src/lib/services/mef-ui-loader.service.ts
async loadCheckbox() {
  return await this.loadComponent('./CheckboxLabel');
}

// 2. ui/src/lib/components/mef-checkbox-wrapper.component.ts
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
    const Component = await this.mefUiLoader.loadCheckbox();
    this.componentRef = this.container.createComponent(Component.CheckboxLabelComponent);

    this.componentRef.instance.checked = this.checked;
    this.componentRef.instance.label = this.label;

    if (this.componentRef.instance.checkedChange) {
      this.componentRef.instance.checkedChange.subscribe((value: boolean) => {
        this.checkedChange.emit(value);
      });
    }
  }
}

// 3. ui/src/index.ts
export * from './lib/components/mef-checkbox-wrapper.component';
```

---

### 2. Usar Componente en Página

**Duración:** 5 minutos

```typescript
// host/src/app/components/mi-pagina/mi-pagina.component.ts
import { Component } from '@angular/core';
import {
  MefButtonWrapperComponent,
  MefAlertWrapperComponent
} from '@mef-frontend-arquetipo/ui';

@Component({
  selector: 'app-mi-pagina',
  standalone: true,
  imports: [
    MefButtonWrapperComponent,
    MefAlertWrapperComponent
  ],
  template: `
    <h1>Mi Página</h1>

    <mef-alert-wrapper
      type="info"
      title="Información"
      message="Esta página usa componentes de MEF UI">
    </mef-alert-wrapper>

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

---

### 3. Testing

#### Unit Tests para Wrappers

```typescript
// ui/src/lib/components/mef-button-wrapper.component.spec.ts
import { TestBed } from '@angular/core/testing';
import { MefButtonWrapperComponent } from './mef-button-wrapper.component';
import { MefUiLoaderService } from '@mef-frontend-arquetipo/shared';

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

  it('should load button component on init', async () => {
    const mockButton = { ButtonComponent: class MockButton {} };
    mockLoader.loadButton.and.returnValue(Promise.resolve(mockButton));

    const fixture = TestBed.createComponent(MefButtonWrapperComponent);
    await fixture.whenStable();

    expect(mockLoader.loadButton).toHaveBeenCalled();
  });
});
```

**Ejecutar tests:**
```bash
npx nx test ui
```

---

### 4. Debugging

#### Verificar Componente Remoto

```typescript
// En cualquier wrapper, agregar logs temporales:
async ngOnInit() {
  console.group('🔍 Debug Wrapper');
  console.log('Loading component...');

  const Component = await this.mefUiLoader.loadButton();
  console.log('Component loaded:', Component);
  console.log('Available properties:', Object.keys(Component));

  this.componentRef = this.container.createComponent(Component.ButtonComponent);
  console.log('Instance created:', this.componentRef.instance);
  console.log('Instance inputs:', Object.keys(this.componentRef.instance));

  console.groupEnd();
}
```

---

## 🔄 Hot Reload

### Qué se Recarga Automáticamente

| Cambio | Recarga | Requiere Rebuild |
|--------|---------|------------------|
| Componente host | ✅ Auto | ❌ No |
| Wrapper en ui/ | ✅ Auto | ❌ No |
| Servicio en shared/ | ❌ Manual | ✅ Sí |
| Componente mef-ui | ✅ Auto | ❌ No |

**Si cambias shared/:**
```bash
# Terminal 3 (temporal)
npx nx build shared
# El hot reload detectará el cambio
```

---

## 📦 Build para Producción

### 1. Build de MEF UI

```bash
cd C:\dev\integracion\mef-design-system-master
npm run ng -- build mef-ui --configuration production

# Output: dist/mef-ui
```

### 2. Build de Arquetipo

```bash
cd C:\dev\integracion\mef-frontend-arquetipo

# Build librerías primero
npx nx build shared --configuration production
npx nx build ui --configuration production

# Build aplicación host
npx nx build host --configuration production

# Output: dist/host
```

### 3. Actualizar Federation Manifest para Producción

```json
// host/public/federation.manifest.json
{
  "catalog": "https://catalog.tu-dominio.com/remoteEntry.json",
  "mef-ui": "https://mef-ui.tu-dominio.com/remoteEntry.json"
}
```

---

## 🔀 Git Workflow

### Estructura de Branches

```
main
├── develop
│   ├── feature/nueva-funcionalidad
│   ├── feature/nuevo-wrapper-checkbox
│   └── bugfix/fix-button-styles
```

### Commits Recomendados

```bash
# Feature
git commit -m "feat(ui): add Checkbox wrapper component"

# Fix
git commit -m "fix(wrapper): resolve onClick event not firing"

# Docs
git commit -m "docs: update integration guide"

# Refactor
git commit -m "refactor(loader): improve error handling"
```

---

## 📊 Monitoreo de Performance

### Tiempo de Carga de Componentes

```typescript
// En MefUiLoaderService
async loadButton() {
  const start = performance.now();

  const module = await loadRemoteModule({
    remoteName: this.remoteName,
    exposedModule: './Button'
  });

  const end = performance.now();
  console.log(`⏱️ Button loaded in ${(end - start).toFixed(2)}ms`);

  return module;
}
```

**Tiempos Esperados:**
- Primera carga: 100-300ms
- Cargas subsecuentes: <50ms (cacheado)

---

## 🛠️ Scripts Útiles

### package.json (Arquetipo)

```json
{
  "scripts": {
    "start": "npx nx serve host",
    "build": "npx nx build host --configuration production",
    "test": "npx nx test",
    "lint": "npx nx lint",

    "build:libs": "npx nx build shared && npx nx build ui",
    "reset": "npx nx reset",

    "mef-ui:start": "cd ../mef-design-system-master && npm run ng -- serve mef-ui"
  }
}
```

**Uso:**
```bash
npm run build:libs  # Build todas las librerías
npm run reset       # Limpiar cache de Nx
```

---

## 📚 Checklist Pre-Deploy

- [ ] ✅ Todos los tests pasan
- [ ] ✅ Lint sin errores
- [ ] ✅ Build de producción exitoso
- [ ] ✅ Federation manifest actualizado para producción
- [ ] ✅ Estilos y fuentes accesibles en CDN/servidor
- [ ] ✅ CORS configurado en servidor
- [ ] ✅ Documentación actualizada

---

## 🎯 Tips de Productividad

1. **Mantener terminales organizados**
   - Terminal 1: mef-ui
   - Terminal 2: host
   - Terminal 3: comandos temporales

2. **Usar alias de terminal**
   ```bash
   alias mef-ui="cd C:/dev/integracion/mef-design-system-master && npm run ng -- serve mef-ui"
   alias mef-host="cd C:/dev/integracion/mef-frontend-arquetipo && npx nx serve host"
   ```

3. **Shortcuts de VSCode**
   - `Ctrl+P`: Búsqueda rápida de archivos
   - `Ctrl+Shift+F`: Buscar en todos los archivos
   - `F12`: Ir a definición

---

**Última actualización:** 3 de Octubre, 2025
