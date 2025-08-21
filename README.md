# Arquetipo Frontend Angular MEF

## 📋 Descripción

Arquetipo de frontend Angular basado en **Architecture Decision Record (ADR)** que implementa:
- ✅ **Angular 18 LTS** con standalone components y signals
- ✅ **Arquitectura Hexagonal** + **Domain-Driven Design (DDD)**
- ✅ **Microfrontends** con Native Federation
- ✅ **TypeScript 5.3** con strict mode
- ✅ **Nx Monorepo** para gestión de múltiples proyectos
- ✅ **Jest** para testing unitario
- ✅ **Playwright** para testing E2E

---

## 🏗️ Arquitectura

### Estructura del Proyecto

```
mef-frontend-arquetipo/
├── apps/
│   ├── host/                    # 🏠 Shell principal (Dynamic Host)
│   ├── catalog/                 # 📦 Microfrontend remoto
│   ├── host-e2e/              # 🧪 Tests E2E para host
│   └── catalog-e2e/           # 🧪 Tests E2E para catalog
├── libs/
│   ├── domain/                 # 🎯 Capa de Dominio (Entidades, VOs, Reglas)
│   ├── application/            # 🔧 Capa de Aplicación (Casos de Uso, Puertos)
│   ├── adapters/              # 🔌 Capa de Infraestructura (HTTP, Storage)
│   ├── ui/                    # 🎨 Componentes UI Transversales
│   └── shared/                # 📚 Utilidades y Tipos Compartidos
└── docs/                      # 📖 Documentación
```

### Diagrama de Arquitectura Hexagonal

```
┌─────────────────────────────────────────────────────────────┐
│                    🎯 DOMAIN LAYER                          │
├─────────────────────────────────────────────────────────────┤
│  • Entities (User, Product)                                │
│  • Value Objects (Email, Money, UserId, ProductId)         │
│  • Domain Errors (UserNotFoundError, ProductNotFoundError) │
│  • Business Rules (isActive, reserveStock)                 │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                  🔧 APPLICATION LAYER                       │
├─────────────────────────────────────────────────────────────┤
│  • Use Cases (CreateUserUseCase, GetProductsUseCase)       │
│  • Ports/Interfaces (UserRepositoryPort, NotificationPort) │
│  • Application Services                                    │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                🔌 INFRASTRUCTURE LAYER                      │
├─────────────────────────────────────────────────────────────┤
│  • HTTP Adapters (RestUserRepository)                      │
│  • Storage Adapters (LocalStorageService)                  │
│  • External API Adapters                                   │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                    🎨 PRESENTATION LAYER                    │
├─────────────────────────────────────────────────────────────┤
│  • Angular Components (Standalone)                         │
│  • UI Library (Buttons, Forms, Modals)                     │
│  • Routing & Navigation                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Comandos Principales

### Instalación y Setup
```bash
# Instalar dependencias
npm install

# Verificar estructura del proyecto
npx nx graph
```

### Desarrollo
```bash
# Servir aplicación host (puerto 4200)
npx nx serve host

# Servir microfrontend catalog (puerto 4201)
npx nx serve catalog

# Compilar todas las librerías
npx nx run-many -t build --projects=domain,application,shared

# Compilar aplicaciones
npx nx run-many -t build --projects=host,catalog
```

### Testing
```bash
# Ejecutar todos los tests unitarios
npx nx run-many -t test

# Tests de una librería específica
npx nx test domain
npx nx test application

# Tests E2E
npx nx e2e host-e2e
npx nx e2e catalog-e2e
```

### Análisis
```bash
# Lint del código
npx nx run-many -t lint

# Análisis de dependencias
npx nx graph

# Ver detalles de un proyecto
npx nx show project domain
```

---

## 📦 Librerías del Proyecto

### 🎯 Domain (`libs/domain`)
**Propósito**: Capa más interna con lógica de negocio pura.

**Contiene**:
- **Entities**: `User`, `Product`
- **Value Objects**: `Email`, `Money`, `UserId`, `ProductId` 
- **Domain Errors**: `UserNotFoundError`, `ProductNotFoundError`
- **Business Rules**: Validaciones y reglas de negocio

**Ejemplo de uso**:
```typescript
import { User, Email, UserId } from '@mef-frontend-arquetipo/domain';

const user = new User(
  UserId.generate(),
  Email.fromString('user@example.com'),
  'John Doe'
);

if (user.isActive()) {
  console.log('Usuario activo');
}
```

### 🔧 Application (`libs/application`)
**Propósito**: Casos de uso y orquestación de la lógica de negocio.

**Contiene**:
- **Ports**: Interfaces para repositorios y servicios externos
- **Use Cases**: Lógica de aplicación
- **Services**: Servicios de aplicación

**Ejemplo de puerto**:
```typescript
export interface UserRepositoryPort {
  findById(id: UserId): Promise<User | null>;
  save(user: User): Promise<void>;
}
```

### 🔌 Adapters (`libs/adapters`)
**Propósito**: Implementaciones concretas de los puertos.

**Contiene**:
- Adaptadores HTTP
- Adaptadores de almacenamiento
- Integraciones con APIs externas

### 🎨 UI (`libs/ui`)
**Propósito**: Componentes de interfaz reutilizables.

**Contiene**:
- Componentes base (botones, inputs, modales)
- Directivas
- Pipes

### 📚 Shared (`libs/shared`)
**Propósito**: Código compartido entre capas.

**Contiene**:
- Tipos TypeScript
- Constantes
- Utilidades

---

## 🔬 Microfrontends con Native Federation

### Configuración Host (Shell)
```javascript
// host/federation.config.js
module.exports = withNativeFederation({
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
});
```

### Configuración Remote (Catalog)
```javascript
// catalog/federation.config.js
module.exports = withNativeFederation({
  name: 'catalog',
  exposes: {
    './Component': './catalog/src/app/app.ts',
  },
  // ... configuración compartida
});
```

### Estructura de Arranque
```typescript
// main.ts (tanto en host como en remotes)
import { initFederation } from '@angular-architects/native-federation';

initFederation()
  .catch(err => console.error(err))
  .then(_ => import('./bootstrap'))
  .catch(err => console.error(err));
```

---

## 🧪 Testing Strategy

### Testing Unitario (Jest)
- **Domain**: Test de entidades, value objects y reglas de negocio
- **Application**: Test de casos de uso y servicios
- **UI**: Test de componentes Angular

```bash
# Ejecutar tests con coverage
npx nx test domain --coverage
```

### Testing E2E (Playwright)
- **Host E2E**: Tests del shell principal
- **Catalog E2E**: Tests del microfrontend

```bash
# Ejecutar tests E2E
npx nx e2e host-e2e
```

---

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Angular** | 18 LTS | Framework principal |
| **TypeScript** | 5.3 | Lenguaje tipado |
| **Nx** | Latest | Monorepo y tooling |
| **Jest** | Latest | Testing unitario |
| **Playwright** | Latest | Testing E2E |
| **Native Federation** | Latest | Microfrontends |
| **RxJS** | 7.x | Programación reactiva |
| **Node.js** | 20.9 | Runtime |
| **NPM** | 10.1.0 | Gestor de paquetes |

---

## 📐 Principios de Arquitectura

### 1. **Domain-Driven Design (DDD)**
- Separación clara de capas
- Modelo de dominio rico
- Lenguaje ubicuo

### 2. **Arquitectura Hexagonal**
- Aislamiento de la lógica de negocio
- Inversión de dependencias
- Testabilidad mejorada

### 3. **Clean Code**
- Código auto-documentado
- Principios SOLID
- Refactoring continuo

### 4. **Microfrontends**
- Despliegue independiente
- Escalabilidad por equipos
- Tecnologías heterogéneas

---

## 📋 Próximos Pasos

- [ ] Implementar casos de uso completos
- [ ] Configurar TanStack Query para server state
- [ ] Crear componentes UI transversales
- [ ] Configurar MSW para mocking
- [ ] Implementar composition root
- [ ] Configurar CI/CD pipeline

---

## 🤝 Contribución

Este arquetipo sigue las especificaciones del **ADR (Architecture Decision Record)** del proyecto MEF.

Para más información sobre la arquitectura y decisiones técnicas, consultar el archivo `adr.txt`.

---

## 📚 Referencias

- [Nx Documentation](https://nx.dev)
- [Angular Architecture Guide](https://angular.io/guide/architecture)
- [Native Federation](https://github.com/angular-architects/native-federation)
- [Domain-Driven Design](https://martinfowler.com/tags/domain%20driven%20design.html)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)