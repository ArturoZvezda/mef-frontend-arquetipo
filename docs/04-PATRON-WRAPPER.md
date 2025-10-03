# Patrón Wrapper para Componentes Remotos

**Versión:** 1.0.0
**Fecha:** 3 de Octubre, 2025

---

## 🎯 ¿Qué es el Patrón Wrapper?

Un **wrapper** (envoltorio) es un componente local que **encapsula** la carga y uso de un componente remoto, proporcionando:
- Interfaz consistente
- Abstracción de detalles de carga
- Facilidad de testing
- Mantenibilidad

---

## 🏗️ Estructura del Wrapper

### Anatomía Completa

```typescript
import { Component, Input, Output, EventEmitter, OnInit,
         ViewChild, ViewContainerRef, ComponentRef } from '@angular/core';
import { MefUiLoaderService } from '@mef-frontend-arquetipo/shared';

@Component({
  selector: 'mef-button-wrapper',              // 1. Selector único
  standalone: true,                            // 2. Standalone
  template: `<div #container></div>`           // 3. Contenedor vacío
})
export class MefButtonWrapperComponent implements OnInit {
  // 4. Referencia al contenedor
  @ViewChild('container', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;

  // 5. Inputs (propiedades del componente)
  @Input() variant: 'filled' | 'outlined' | 'text' = 'filled';
  @Input() textButton: string = 'Button';
  @Input() disabled: boolean = false;

  // 6. Outputs (eventos del componente)
  @Output() onClick = new EventEmitter<void>();

  // 7. Referencia al componente instanciado
  private componentRef?: ComponentRef<any>;

  // 8. Inyectar servicio de carga
  constructor(private mefUiLoader: MefUiLoaderService) {}

  // 9. Cargar en ngOnInit
  async ngOnInit() {
    try {
      // a) Cargar componente remoto
      const RemoteComponent = await this.mefUiLoader.loadButton();

      // b) Crear instancia
      this.componentRef = this.container.createComponent(
        RemoteComponent.ButtonComponent
      );

      // c) Mapear inputs
      this.componentRef.instance.variant = this.variant;
      this.componentRef.instance.textButton = this.textButton;
      this.componentRef.instance.disabled = this.disabled;

      // d) Suscribirse a outputs
      if (this.componentRef.instance.onClick) {
        this.componentRef.instance.onClick.subscribe(() => {
          this.onClick.emit();
        });
      }
    } catch (error) {
      console.error('Error loading MEF UI Button:', error);
    }
  }

  // 10. Cleanup (opcional)
  ngOnDestroy() {
    this.componentRef?.destroy();
  }
}
```

---

## 📝 Pasos para Crear un Wrapper

### Paso 1: Crear Archivo

```bash
# Ubicación
ui/src/lib/components/mef-[componente]-wrapper.component.ts
```

### Paso 2: Definir Inputs/Outputs

```typescript
// Investigar qué propiedades tiene el componente remoto
// Ejemplo para TextField:
@Input() label: string = '';
@Input() placeholder: string = '';
@Input() type: 'text' | 'email' | 'password' = 'text';
@Input() disabled: boolean = false;
@Input() required: boolean = false;
@Output() valueChange = new EventEmitter<string>();
```

### Paso 3: Implementar Carga

```typescript
async ngOnInit() {
  const Component = await this.mefUiLoader.loadTextField();
  this.componentRef = this.container.createComponent(Component.TextFieldComponent);

  // Mapear TODOS los inputs
  this.componentRef.instance.label = this.label;
  this.componentRef.instance.placeholder = this.placeholder;
  // ...
}
```

### Paso 4: Exportar

```typescript
// ui/src/index.ts
export * from './lib/components/mef-textfield-wrapper.component';
```

---

## ✅ Ventajas del Patrón

### 1. Testabilidad

**Sin Wrapper:**
```typescript
// Difícil de testear - depende de remote real
it('should render button', async () => {
  const remote = await loadRemoteModule({...}); // Requiere servidor
  // ...
});
```

**Con Wrapper:**
```typescript
// Fácil de testear - mock del loader
it('should render button', () => {
  const mockLoader = jasmine.createSpyObj('MefUiLoaderService', ['loadButton']);
  mockLoader.loadButton.and.returnValue(Promise.resolve(mockComponent));

  const fixture = TestBed.createComponent(MefButtonWrapperComponent);
  // Test normal
});
```

### 2. Mantenibilidad

Si mef-ui cambia su API:
- ❌ Sin wrapper: Cambiar en TODOS los componentes
- ✅ Con wrapper: Cambiar solo en UN lugar (el wrapper)

### 3. Consistencia

```typescript
// Interfaz consistente en toda la app
<mef-button-wrapper variant="filled" textButton="Save"></mef-button-wrapper>
<mef-alert-wrapper type="success" message="Done"></mef-alert-wrapper>
<mef-text-field-wrapper label="Email" type="email"></mef-text-field-wrapper>
```

---

## 🎨 Variaciones del Patrón

### Wrapper con Estado

```typescript
export class MefAccordionWrapperComponent implements OnInit {
  @Input() title: string = '';
  @Input() initiallyOpen: boolean = false;

  private isOpen = false;

  toggle() {
    this.isOpen = !this.isOpen;
    this.componentRef.instance.open = this.isOpen;
  }
}
```

### Wrapper con Transformación de Datos

```typescript
export class MefDatePickerWrapperComponent implements OnInit {
  @Input() date?: Date;
  @Output() dateChange = new EventEmitter<Date>();

  async ngOnInit() {
    // ...
    // Transformar Date a string para el componente remoto
    this.componentRef.instance.dateString = this.date?.toISOString();

    // Transformar string a Date en output
    this.componentRef.instance.dateStringChange.subscribe((str: string) => {
      this.dateChange.emit(new Date(str));
    });
  }
}
```

---

## 🔧 Template para Nuevos Wrappers

```typescript
import { Component, Input, Output, EventEmitter, OnInit,
         ViewChild, ViewContainerRef, ComponentRef } from '@angular/core';
import { MefUiLoaderService } from '@mef-frontend-arquetipo/shared';

/**
 * Wrapper para [NOMBRE] de MEF UI
 *
 * @Input [prop1] - Descripción
 * @Output [event1] - Descripción
 */
@Component({
  selector: 'mef-[nombre]-wrapper',
  standalone: true,
  template: `<div #container></div>`
})
export class Mef[Nombre]WrapperComponent implements OnInit {
  @ViewChild('container', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;

  // TODO: Definir inputs y outputs
  @Input() prop1: string = '';
  @Output() event1 = new EventEmitter<void>();

  private componentRef?: ComponentRef<any>;

  constructor(private mefUiLoader: MefUiLoaderService) {}

  async ngOnInit() {
    try {
      // TODO: Cambiar nombre del método
      const Component = await this.mefUiLoader.load[Nombre]();

      // TODO: Cambiar nombre del componente
      this.componentRef = this.container.createComponent(
        Component.[Nombre]Component
      );

      // TODO: Mapear inputs
      this.componentRef.instance.prop1 = this.prop1;

      // TODO: Suscribirse a outputs
      if (this.componentRef.instance.event1) {
        this.componentRef.instance.event1.subscribe(() => {
          this.event1.emit();
        });
      }
    } catch (error) {
      console.error('Error loading MEF UI [Nombre]:', error);
    }
  }

  ngOnDestroy() {
    this.componentRef?.destroy();
  }
}
```

---

## 📚 Ejemplos Completos

Ver implementaciones reales en:
- `ui/src/lib/components/mef-button-wrapper.component.ts`
- `ui/src/lib/components/mef-alert-wrapper.component.ts`
- `ui/src/lib/components/mef-text-field-wrapper.component.ts`

---

**Última actualización:** 3 de Octubre, 2025
