# Microfrontends con Native Federation - MEF Frontend

## 🔬 Introducción a Microfrontends

Los microfrontends son una extensión de los microservicios al frontend, permitiendo:
- ✅ **Despliegue independiente** por equipos
- ✅ **Escalabilidad técnica** y organizacional  
- ✅ **Tecnologías heterogéneas** en el mismo ecosistema
- ✅ **Aislamiento de fallos** entre módulos

---

## 🏗️ Arquitectura de Microfrontends

```
┌─────────────────────────────────────────────────────────┐
│                    🏠 HOST (Shell)                      │
├─────────────────────────────────────────────────────────┤
│  • Routing principal                                   │
│  • Shared dependencies                                 │
│  • Shell UI (header, navigation, footer)              │
│  • Orquestación de microfrontends                     │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│   📦 CATALOG   │   │   🛒 CART     │   │   👤 PROFILE  │
├───────────────┤   ├───────────────┤   ├───────────────┤
│ • Product Mgmt │   │ • Shopping    │   │ • User Mgmt   │
│ • Inventory    │   │ • Checkout    │   │ • Settings    │
│ • Search       │   │ • Payments    │   │ • Auth        │
└───────────────┘   └───────────────┘   └───────────────┘
```

---

## 🔧 Configuración Native Federation

### Host Configuration (`host/federation.config.js`)

```javascript
const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  // Host no expone módulos, solo consume
  name: 'shell',
  
  shared: {
    // Compartir todas las dependencias de Angular
    ...shareAll({ 
      singleton: true, 
      strictVersion: true, 
      requiredVersion: 'auto' 
    }),
  },

  // Paquetes que no se comparten (optimización)
  skip: [
    'rxjs/ajax',
    'rxjs/fetch', 
    'rxjs/testing',
    'rxjs/webSocket',
    // Agregar paquetes que no necesitas en runtime
  ],

  features: {
    // Mejora performance evitando issues con node libs
    ignoreUnusedDeps: true
  }
});
```

### Remote Configuration (`catalog/federation.config.js`)

```javascript
const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  // Nombre único del microfrontend
  name: 'catalog',

  // Módulos que este microfrontend expone
  exposes: {
    './routes': './src/app/app.routes.ts',
    './Component': './src/app/catalog/catalog.component.ts',
    './ProductService': './src/app/services/product.service.ts'
  },

  shared: {
    ...shareAll({ 
      singleton: true, 
      strictVersion: true, 
      requiredVersion: 'auto' 
    }),
  },

  skip: [
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing', 
    'rxjs/webSocket',
  ],

  features: {
    ignoreUnusedDeps: true
  }
});
```

---

## 🚀 Bootstrap Pattern

### Main.ts (Host y Remotes)
```typescript
import { initFederation } from '@angular-architects/native-federation';

// Inicializar federación antes de bootstrapear Angular
initFederation()
  .catch(err => console.error('Federation init failed:', err))
  .then(_ => import('./bootstrap'))
  .catch(err => console.error('Bootstrap failed:', err));
```

### Bootstrap.ts
```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error('App bootstrap failed:', err));
```

---

## 🛣️ Dynamic Routing

### Host Routes Configuration
```typescript
// host/src/app/app.routes.ts
import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/catalog',
    pathMatch: 'full'
  },
  {
    path: 'catalog',
    loadChildren: () => 
      loadRemoteModule('catalog', './routes').then(m => m.CATALOG_ROUTES)
  },
  {
    path: 'cart',
    loadChildren: () =>
      loadRemoteModule('cart', './routes').then(m => m.CART_ROUTES)
  },
  // Fallback para rutas no encontradas
  {
    path: '**',
    loadComponent: () => import('./not-found/not-found.component').then(c => c.NotFoundComponent)
  }
];
```

### Remote Routes Export
```typescript
// catalog/src/app/app.routes.ts
import { Routes } from '@angular/router';

export const CATALOG_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./catalog/catalog.component').then(c => c.CatalogComponent),
    children: [
      {
        path: 'products',
        loadComponent: () => import('./products/products.component').then(c => c.ProductsComponent)
      },
      {
        path: 'products/:id',
        loadComponent: () => import('./product-detail/product-detail.component').then(c => c.ProductDetailComponent)
      }
    ]
  }
];
```

---

## 🔄 Comunicación entre Microfrontends

### 1. Shared Services (Singleton Pattern)
```typescript
// shared/src/lib/services/global-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root' // Singleton en toda la aplicación
})
export class GlobalStateService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItems.asObservable();

  addToCart(item: CartItem): void {
    const current = this.cartItems.value;
    this.cartItems.next([...current, item]);
  }

  removeFromCart(itemId: string): void {
    const current = this.cartItems.value;
    this.cartItems.next(current.filter(item => item.id !== itemId));
  }

  getCartCount(): number {
    return this.cartItems.value.length;
  }
}
```

### 2. Event Bus Pattern
```typescript
// shared/src/lib/services/event-bus.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export interface MfEvent {
  type: string;
  payload?: any;
}

@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  private eventSubject = new Subject<MfEvent>();

  emit(event: MfEvent): void {
    this.eventSubject.next(event);
  }

  on<T>(eventType: string) {
    return this.eventSubject.pipe(
      filter(event => event.type === eventType),
      map(event => event.payload as T)
    );
  }
}

// Uso en catalog microfrontend
export class ProductComponent {
  constructor(private eventBus: EventBusService) {}

  addToCart(product: Product): void {
    this.eventBus.emit({
      type: 'PRODUCT_ADDED_TO_CART',
      payload: { product, quantity: 1 }
    });
  }
}

// Uso en cart microfrontend
export class CartComponent implements OnInit {
  constructor(private eventBus: EventBusService) {}

  ngOnInit(): void {
    this.eventBus.on<{product: Product, quantity: number}>('PRODUCT_ADDED_TO_CART')
      .subscribe(({ product, quantity }) => {
        this.addProductToCart(product, quantity);
      });
  }
}
```

### 3. Custom Elements (Web Components)
```typescript
// Exportar componente como Custom Element
import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';

// En el remote
async function bootstrapCustomElement() {
  const app = await createApplication({
    providers: [
      // providers necesarios
    ]
  });

  const customElement = createCustomElement(ProductCardComponent, {
    injector: app.injector
  });

  customElements.define('mef-product-card', customElement);
}

bootstrapCustomElement();

// En el host o cualquier microfrontend
// <mef-product-card [product]="product"></mef-product-card>
```

---

## 📦 Shared Dependencies Management

### Package.json Strategy
```json
{
  "dependencies": {
    "@angular/core": "^18.0.0",
    "@angular/common": "^18.0.0",
    "@angular/router": "^18.0.0",
    "rxjs": "^7.8.0",
    
    // Shared libraries
    "@mef-frontend-arquetipo/domain": "*",
    "@mef-frontend-arquetipo/shared": "*"
  },
  "peerDependencies": {
    // Dependencies que se esperan del host
    "@mef-frontend-arquetipo/ui": "*"
  }
}
```

### Runtime Sharing Configuration
```javascript
// federation.config.js
module.exports = withNativeFederation({
  shared: {
    // Angular framework - singleton obligatorio
    '@angular/core': { singleton: true, strictVersion: true },
    '@angular/common': { singleton: true, strictVersion: true },
    '@angular/router': { singleton: true, strictVersion: true },
    
    // RxJS - singleton para evitar problemas de operadores
    'rxjs': { singleton: true, strictVersion: true },
    
    // Librerías del monorepo - siempre singleton
    '@mef-frontend-arquetipo/domain': { singleton: true },
    '@mef-frontend-arquetipo/shared': { singleton: true },
    
    // Librerías externas opcionales
    'lodash': { singleton: false, requiredVersion: 'auto' }
  }
});
```

---

## 🧪 Testing Microfrontends

### Unit Testing de Remotes
```typescript
// catalog/src/app/product/product.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductComponent } from './product.component';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductComponent] // standalone component
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit add to cart event', () => {
    // Test específico del microfrontend
  });
});
```

### Integration Testing
```typescript
// host/src/app/app.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

describe('Host Integration', () => {
  let router: Router;
  let location: Location;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        // Mock de loadRemoteModule para tests
        {
          provide: 'loadRemoteModule',
          useValue: jest.fn().mockResolvedValue({ CATALOG_ROUTES: [] })
        }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(AppComponent);
  });

  it('should navigate to catalog', async () => {
    await router.navigate(['/catalog']);
    expect(location.path()).toBe('/catalog');
  });
});
```

### E2E Testing con Multiple Apps
```typescript
// host-e2e/src/example.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Microfrontend Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Iniciar host y remotes
    await page.goto('http://localhost:4200');
  });

  test('should load catalog microfrontend', async ({ page }) => {
    await page.click('nav a[href="/catalog"]');
    
    // Verificar que se carga el microfrontend
    await expect(page.locator('[data-testid="catalog-container"]')).toBeVisible();
    
    // Verificar funcionalidad específica del microfrontend
    await page.click('[data-testid="add-to-cart-btn"]');
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');
  });

  test('should communicate between microfrontends', async ({ page }) => {
    // Agregar producto desde catalog
    await page.goto('http://localhost:4200/catalog');
    await page.click('[data-testid="product-1"] [data-testid="add-to-cart"]');
    
    // Verificar en cart
    await page.goto('http://localhost:4200/cart');
    await expect(page.locator('[data-testid="cart-items"]')).toContainText('Product 1');
  });
});
```

---

## 🚀 Deployment Strategy

### Build Process
```bash
# Build todos los microfrontends
npm run build:all

# O individualmente
npx nx build host
npx nx build catalog
npx nx build cart
```

### Docker Strategy
```dockerfile
# Dockerfile.host
FROM nginx:alpine

# Copiar archivos estáticos del host
COPY dist/host /usr/share/nginx/html

# Configuración nginx para SPA
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Kubernetes Deployment
```yaml
# k8s/host-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mef-host
spec:
  replicas: 3
  selector:
    matchLabels:
      app: mef-host
  template:
    metadata:
      labels:
        app: mef-host
    spec:
      containers:
      - name: mef-host
        image: mef-host:latest
        ports:
        - containerPort: 80
        env:
        - name: CATALOG_URL
          value: "https://catalog.mef.com"
        - name: CART_URL
          value: "https://cart.mef.com"
---
apiVersion: v1
kind: Service
metadata:
  name: mef-host-service
spec:
  selector:
    app: mef-host
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

---

## ⚠️ Consideraciones y Best Practices

### 1. Performance
- ✅ Lazy loading de microfrontends
- ✅ Shared dependencies para evitar duplicación
- ✅ Tree shaking en build
- ⚠️ Evitar over-sharing de dependencias

### 2. Governance
- ✅ Contracts entre microfrontends (APIs, eventos)
- ✅ Versionado semántico de shared libraries
- ✅ Testing de integración automatizado
- ⚠️ Evitar breaking changes en shared contracts

### 3. Security
- ✅ CSP (Content Security Policy) adecuado
- ✅ Sanitización de datos entre microfrontends
- ✅ Authentication/Authorization centralizado
- ⚠️ Validar inputs de otros microfrontends

### 4. Monitoring
- ✅ Logging centralizado
- ✅ Error tracking por microfrontend
- ✅ Performance monitoring
- ✅ User journey tracking cross-microfrontends

---

## 🎯 Próximos Pasos

1. **Implementar más remotes**: Cart, Profile, Admin
2. **Configurar shared state management**: NgRx o TanStack Query
3. **Implementar error boundaries**: Manejo de errores entre MF
4. **Configurar monitoring**: Telemetría y observabilidad
5. **Optimizar performance**: Preloading strategies