# Guía de Inicio Rápido - Arquetipo MEF Frontend

## 🚀 Quick Start

### Prerequisitos
- **Node.js 20.9+**
- **NPM 10.1.0+**
- **Git**

### 1. Clonar e Instalar
```bash
cd mef-frontend-arquetipo
npm install
```

### 2. Verificar Instalación
```bash
# Ver estructura del proyecto
npx nx graph

# Compilar librerías core
npx nx build domain
npx nx build application
npx nx build shared
```

### 3. Ejecutar en Desarrollo
```bash
# Terminal 1: Catalog microfrontend
npx nx serve catalog --port=4201

# Terminal 2: Host application  
npx nx serve host --port=4200
```

### 4. Ejecutar Tests
```bash
# Tests unitarios
npx nx test domain
npx nx test application

# Tests E2E
npx nx e2e host-e2e
```

---

## 🏗️ Estructura del Proyecto

```
mef-frontend-arquetipo/
├── 📁 apps/
│   ├── host/              # 🏠 Shell principal (puerto 4200)
│   └── catalog/           # 📦 Microfrontend remoto (puerto 4201)
│
├── 📁 libs/
│   ├── domain/            # 🎯 Entidades, Value Objects, Domain Errors  
│   ├── application/       # 🔧 Casos de Uso, Puertos, Services
│   ├── adapters/          # 🔌 HTTP, Storage, External APIs
│   ├── ui/               # 🎨 Componentes UI reutilizables
│   └── shared/           # 📚 Utilities, Types, Constants
│
├── 📁 docs/               # 📖 Documentación técnica
│   ├── ARCHITECTURE.md    # Arquitectura detallada
│   ├── MICROFRONTENDS.md  # Guía de microfrontends  
│   └── GETTING_STARTED.md # Esta guía
│
└── 📄 Files principales
    ├── README.md          # Documentación principal
    ├── adr.txt           # Architecture Decision Record
    └── nx.json           # Configuración Nx workspace
```

---

## 📦 Librerías Implementadas

### 🎯 Domain Layer
- ✅ **User Entity** con reglas de negocio
- ✅ **Product Entity** con gestión de stock
- ✅ **Value Objects**: Email, Money, UserId, ProductId
- ✅ **Domain Errors** tipados para manejo de errores

### 🔧 Application Layer  
- ✅ **Ports** (interfaces) para repositorios
- ✅ **Use Cases** básicos (estructura preparada)
- ✅ **Application Services** (estructura preparada)

### 🔌 Infrastructure Layer
- ✅ **Adapters** preparados para HTTP y Storage
- 🔄 **Implementaciones específicas** (pendiente)

### 🎨 UI Layer
- ✅ **Componentes Angular** standalone preparados
- 🔄 **UI Library transversal** (pendiente)

---

## 🛠️ Comandos Útiles

### Desarrollo
```bash
# Desarrollo paralelo (recomendado)
npm run dev:all        # Ejecuta host + catalog simultáneamente

# Desarrollo individual  
npx nx serve host      # Solo shell en puerto 4200
npx nx serve catalog   # Solo microfrontend en puerto 4201
```

### Build y Deploy
```bash
# Build completo
npm run build:all

# Build individual
npx nx build host
npx nx build catalog

# Build librerías
npx nx run-many -t build --projects=domain,application,shared
```

### Testing
```bash
# Tests completos
npm run test:all

# Tests por proyecto
npx nx test domain
npx nx test application  
npx nx test host
npx nx test catalog

# Tests E2E
npx nx e2e host-e2e
npx nx e2e catalog-e2e
```

### Análisis y Calidad
```bash
# Lint completo
npm run lint:all

# Lint individual
npx nx lint domain
npx nx lint host

# Análisis de dependencias  
npx nx graph

# Información de proyecto
npx nx show project domain
```

---

## 🎯 Arquitectura en 5 Minutos

### 1. Domain-Driven Design (DDD)
```typescript
// Ejemplo: Crear usuario con validaciones de dominio
import { User, Email, UserId } from '@mef-frontend-arquetipo/domain';

const user = new User(
  UserId.generate(),
  Email.fromString('user@example.com'),  // Validación automática
  'John Doe'
);

console.log(user.isActive()); // Regla de negocio
```

### 2. Arquitectura Hexagonal
```
Domain (Core) ← Application (Use Cases) ← Infrastructure (Adapters) ← Presentation (Angular)
```

### 3. Microfrontends
- **Host** (`localhost:4200`): Shell principal con routing
- **Catalog** (`localhost:4201`): Microfrontend de productos
- **Comunicación**: Shared services y event bus

---

## 🧪 Testing Strategy

### Domain Tests (Lógica de Negocio)
```typescript
describe('User Entity', () => {
  it('should validate email format', () => {
    expect(() => {
      Email.fromString('invalid-email');
    }).toThrow();
  });
});
```

### Application Tests (Use Cases)  
```typescript
describe('CreateUserUseCase', () => {
  it('should create user with mocked dependencies', () => {
    // Mock repositories y test casos de uso
  });
});
```

### E2E Tests (Flujos completos)
```typescript
test('should navigate between microfrontends', async ({ page }) => {
  await page.goto('http://localhost:4200');
  await page.click('[href="/catalog"]');
  await expect(page).toHaveURL(/catalog/);
});
```

---

## 🔧 Personalización y Extensión

### Agregar Nueva Entidad
```bash
# 1. Crear entidad en domain
touch domain/src/lib/entities/order.entity.ts

# 2. Crear repositorio en application  
touch application/src/lib/ports/order-repository.port.ts

# 3. Crear adapter en infrastructure
touch adapters/src/lib/http/order-http.adapter.ts

# 4. Actualizar exports
# domain/src/index.ts
# application/src/index.ts  
# adapters/src/index.ts
```

### Agregar Nuevo Microfrontend
```bash
# 1. Crear nueva aplicación
npx nx generate @nx/angular:application orders --routing --standalone --unitTestRunner=jest --e2eTestRunner=playwright

# 2. Configurar Native Federation
# orders/federation.config.js

# 3. Actualizar routing en host
# host/src/app/app.routes.ts
```

### Agregar Componente UI
```bash
# 1. Generar componente en UI lib
npx nx generate @nx/angular:component button --project=ui --standalone

# 2. Exportar en index
# ui/src/index.ts

# 3. Usar en cualquier app
import { ButtonComponent } from '@mef-frontend-arquetipo/ui';
```

---

## 📚 Próximos Pasos Sugeridos

### Desarrollo
1. **Implementar casos de uso completos** (siguiente paso)
2. **Configurar TanStack Query** para server state
3. **Crear componentes UI transversales**  
4. **Implementar MSW** para mocking en tests

### DevOps
1. **Configurar CI/CD pipeline**
2. **Setup de pre-commit hooks**
3. **Configurar análisis de código** (SonarQube)
4. **Implementar deployment automatizado**

### Arquitectura Avanzada  
1. **Error boundaries** para microfrontends
2. **State management** centralizado
3. **Micro-apps** independientes por dominio
4. **Performance optimization**

---

## 🤝 Soporte y Contribución

### Documentación
- 📖 `README.md` - Documentación principal
- 🏗️ `docs/ARCHITECTURE.md` - Arquitectura detallada  
- 🔬 `docs/MICROFRONTENDS.md` - Guía de microfrontends
- 📋 `adr.txt` - Decisiones arquitectónicas

### Resolución de Problemas
1. **Build fails**: Verificar versiones de Node/NPM
2. **Federation errors**: Revisar puertos y configuración
3. **Test failures**: Verificar mocks y configuración Jest
4. **Lint errors**: Ejecutar `npx nx run-many -t lint --fix`

### Contribuir al Arquetipo
1. Fork del repositorio
2. Crear branch feature
3. Seguir patrones arquitectónicos establecidos
4. Agregar tests apropiados
5. Actualizar documentación
6. Pull request con descripción detallada

---

## 🎉 ¡Listo para Desarrollar!

El arquetipo está configurado y listo para usar. Todos los elementos fundamentales están implementados:

- ✅ **Arquitectura hexagonal** con DDD
- ✅ **Microfrontends** con Native Federation  
- ✅ **Testing strategy** completa
- ✅ **Documentación** detallada
- ✅ **Build y deploy** configurados

**¡Hora de construir features increíbles! 🚀**