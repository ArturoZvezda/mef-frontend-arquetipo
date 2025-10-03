# Arquitectura Hexagonal en MEF Frontend Arquetipo

**Versión:** 1.0.0
**Fecha:** 3 de Octubre, 2025

---

## 📋 Tabla de Contenidos

1. [¿Qué es la Arquitectura Hexagonal?](#qué-es-la-arquitectura-hexagonal)
2. [Principios Fundamentales](#principios-fundamentales)
3. [Estructura de Capas](#estructura-de-capas)
4. [Aplicación en el Proyecto](#aplicación-en-el-proyecto)
5. [Integración con MEF UI](#integración-con-mef-ui)
6. [Ejemplos Prácticos](#ejemplos-prácticos)
7. [Ventajas y Desventajas](#ventajas-y-desventajas)

---

## 🎯 ¿Qué es la Arquitectura Hexagonal?

La **Arquitectura Hexagonal** (también conocida como **Ports and Adapters**) es un patrón arquitectónico que busca crear aplicaciones loosely coupled, donde la lógica de negocio está completamente aislada de los detalles de implementación externos.

### Metáfora del Hexágono

```
                    ╔═══════════════════╗
                    ║                   ║
        Adaptador ──╣     NÚCLEO        ║── Adaptador
         UI          ║    (Dominio)     ║    HTTP
                    ║                   ║
        Adaptador ──╣   Reglas de       ║── Adaptador
        Storage      ║    Negocio       ║    Email
                    ║                   ║
                    ╚═══════════════════╝
```

El núcleo (hexágono central) contiene la lógica de negocio pura, y los adaptadores externos se conectan a través de **puertos** bien definidos.

---

## 🔑 Principios Fundamentales

### 1. Inversión de Dependencias

**Regla de Oro:** Las dependencias apuntan hacia adentro, nunca hacia afuera.

```
Dominio (núcleo) ← Application ← Infrastructure ← Presentation
     NO DEPENDE DE NADA     ↑         ↑              ↑
                            │         │              │
                      DEPENDE    DEPENDE        DEPENDE
```

### 2. Separación de Responsabilidades

Cada capa tiene una responsabilidad específica:

| Capa | Responsabilidad | Ejemplo |
|------|-----------------|---------|
| **Dominio** | Lógica de negocio pura | `User`, `Product`, reglas de validación |
| **Aplicación** | Casos de uso, orquestación | `CreateUserUseCase`, `GetProductsUseCase` |
| **Infraestructura** | Implementaciones concretas | `HttpUserRepository`, `LocalStorageService` |
| **Presentación** | Interfaz de usuario | Componentes Angular, páginas |

### 3. Puertos y Adaptadores

**Puerto (Port):** Interfaz que define un contrato

```typescript
// Puerto - Define QUÉ se debe hacer
export interface UserRepositoryPort {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
  delete(id: string): Promise<void>;
}
```

**Adaptador (Adapter):** Implementación concreta del puerto

```typescript
// Adaptador HTTP - Define CÓMO se hace
@Injectable()
export class HttpUserRepository implements UserRepositoryPort {
  constructor(private http: HttpClient) {}

  async findById(id: string): Promise<User | null> {
    const dto = await this.http.get<UserDto>(`/api/users/${id}`).toPromise();
    return dto ? User.fromDto(dto) : null;
  }

  async save(user: User): Promise<void> {
    await this.http.post('/api/users', user.toDto()).toPromise();
  }

  async delete(id: string): Promise<void> {
    await this.http.delete(`/api/users/${id}`).toPromise();
  }
}
```

---

## 🏛️ Estructura de Capas

### Diagrama Completo del Proyecto

```
mef-frontend-arquetipo/
│
├── 🎯 DOMAIN (Núcleo)
│   └── domain/
│       ├── entities/
│       │   ├── user.entity.ts           # User, Product
│       │   └── product.entity.ts
│       ├── value-objects/
│       │   ├── email.vo.ts              # Email, Money, UserId
│       │   └── user-id.vo.ts
│       └── errors/
│           └── domain.errors.ts         # UserNotFoundError
│
├── 🔧 APPLICATION (Casos de Uso)
│   └── application/
│       ├── ports/
│       │   ├── user-repository.port.ts  # Interfaces (contratos)
│       │   └── notification.port.ts
│       ├── use-cases/
│       │   ├── create-user.usecase.ts   # Lógica de aplicación
│       │   └── get-products.usecase.ts
│       └── services/
│           └── event-handler.service.ts
│
├── 🔌 ADAPTERS (Implementaciones)
│   └── adapters/
│       ├── http/
│       │   └── http-user.repository.ts  # Implementa UserRepositoryPort
│       ├── storage/
│       │   └── local-storage.service.ts
│       └── external/
│           └── email.adapter.ts
│
├── 🎨 UI (Componentes de Presentación)
│   └── ui/
│       └── components/
│           ├── mef-button-wrapper.component.ts
│           ├── mef-alert-wrapper.component.ts
│           └── mef-text-field-wrapper.component.ts
│
├── 📚 SHARED (Utilidades Compartidas)
│   └── shared/
│       ├── services/
│       │   └── mef-ui-loader.service.ts
│       ├── types/
│       └── constants/
│
└── 🏠 HOST (Aplicación Principal)
    └── host/
        └── src/app/
            └── components/
                └── mef-ui-demo/
                    └── mef-ui-demo.component.ts
```

### Detalle de Cada Capa

#### 1. Domain (🎯 Núcleo)

**Características:**
- ❌ NO tiene dependencias externas
- ✅ Contiene toda la lógica de negocio
- ✅ Define entidades y value objects
- ✅ Establece reglas de dominio

**Ejemplo: Entity**

```typescript
// domain/entities/user.entity.ts
import { Email } from '../value-objects/email.vo';
import { UserId } from '../value-objects/user-id.vo';

export class User {
  constructor(
    public readonly id: UserId,
    public readonly email: Email,
    public name: string,
    private active: boolean = true
  ) {}

  // Lógica de negocio pura
  activate(): void {
    this.active = true;
  }

  deactivate(): void {
    this.active = false;
  }

  isActive(): boolean {
    return this.active;
  }

  changeName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error('Name cannot be empty');
    }
    this.name = newName;
  }
}
```

**Ejemplo: Value Object**

```typescript
// domain/value-objects/email.vo.ts
export class Email {
  private constructor(private readonly value: string) {}

  static fromString(email: string): Email {
    if (!this.isValid(email)) {
      throw new Error('Invalid email format');
    }
    return new Email(email.toLowerCase());
  }

  private static isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  toString(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
```

#### 2. Application (🔧 Casos de Uso)

**Características:**
- ✅ Depende solo del Domain
- ✅ Define puertos (interfaces)
- ✅ Orquesta la lógica de negocio
- ❌ NO conoce detalles de implementación

**Ejemplo: Puerto**

```typescript
// application/ports/user-repository.port.ts
import { User } from '@mef-frontend-arquetipo/domain';

export interface UserRepositoryPort {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
  delete(id: string): Promise<void>;
  findAll(): Promise<User[]>;
}
```

**Ejemplo: Caso de Uso**

```typescript
// application/use-cases/create-user.usecase.ts
import { Injectable, Inject } from '@angular/core';
import { User, Email, UserId } from '@mef-frontend-arquetipo/domain';
import { UserRepositoryPort } from '../ports/user-repository.port';
import { NotificationPort } from '../ports/notification.port';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('UserRepositoryPort') private userRepo: UserRepositoryPort,
    @Inject('NotificationPort') private notifier: NotificationPort
  ) {}

  async execute(email: string, name: string): Promise<User> {
    // 1. Validar que no exista
    const existing = await this.userRepo.findByEmail(email);
    if (existing) {
      throw new Error('User already exists');
    }

    // 2. Crear entidad de dominio
    const user = new User(
      UserId.generate(),
      Email.fromString(email),
      name
    );

    // 3. Guardar
    await this.userRepo.save(user);

    // 4. Notificar
    await this.notifier.notify(`User ${name} created successfully`);

    return user;
  }
}
```

#### 3. Adapters (🔌 Infraestructura)

**Características:**
- ✅ Implementa los puertos definidos en Application
- ✅ Conoce detalles técnicos (HTTP, DB, etc.)
- ✅ Se puede reemplazar sin afectar el núcleo

**Ejemplo: Adaptador HTTP**

```typescript
// adapters/http/http-user.repository.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserRepositoryPort } from '@mef-frontend-arquetipo/application';
import { User, Email, UserId } from '@mef-frontend-arquetipo/domain';

interface UserDto {
  id: string;
  email: string;
  name: string;
  active: boolean;
}

@Injectable()
export class HttpUserRepository implements UserRepositoryPort {
  private readonly baseUrl = '/api/users';

  constructor(private http: HttpClient) {}

  async findById(id: string): Promise<User | null> {
    try {
      const dto = await this.http.get<UserDto>(`${this.baseUrl}/${id}`).toPromise();
      return dto ? this.toDomain(dto) : null;
    } catch {
      return null;
    }
  }

  async save(user: User): Promise<void> {
    const dto = this.toDto(user);
    await this.http.post(this.baseUrl, dto).toPromise();
  }

  // Mappers
  private toDomain(dto: UserDto): User {
    return new User(
      UserId.fromString(dto.id),
      Email.fromString(dto.email),
      dto.name,
      dto.active
    );
  }

  private toDto(user: User): UserDto {
    return {
      id: user.id.toString(),
      email: user.email.toString(),
      name: user.name,
      active: user.isActive()
    };
  }
}
```

#### 4. UI (🎨 Presentación)

**Características:**
- ✅ Componentes standalone de Angular
- ✅ Usa casos de uso de Application
- ✅ Maneja interacciones del usuario
- ✅ Se puede cambiar sin afectar la lógica

---

## 🔗 Integración con MEF UI

### ¿Dónde Entra MEF UI en la Arquitectura Hexagonal?

MEF UI se integra como un **adaptador de presentación** en la capa UI:

```
┌─────────────────────────────────────────────────────────────┐
│                    CAPA UI (Adaptadores)                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐        ┌──────────────────┐          │
│  │  Componentes     │        │  MEF UI          │          │
│  │  Propios         │        │  (Wrapper)       │          │
│  │                  │        │                  │          │
│  │  - Dashboard     │        │  - Button        │          │
│  │  - Forms         │        │  - Alert         │          │
│  │  - Tables        │        │  - TextField     │          │
│  └──────────────────┘        └──────────────────┘          │
│           │                           │                     │
│           └───────────┬───────────────┘                     │
│                       ▼                                     │
│           ┌────────────────────────┐                        │
│           │   Application Layer    │                        │
│           │   (Casos de Uso)       │                        │
│           └────────────────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

### Patrón Wrapper: Mantener el Hexágono Intacto

El patrón wrapper nos permite:

1. **Aislar la dependencia externa** (MEF UI remoto)
2. **Mantener una interfaz consistente** en nuestra aplicación
3. **Facilitar testing** con mocks del loader
4. **Permitir reemplazo** del sistema de diseño sin cambiar lógica

**Sin Wrapper (❌ Viola arquitectura):**

```typescript
// Componente acoplado directamente a MEF UI remoto
async ngOnInit() {
  const RemoteButton = await loadRemoteModule({
    remoteName: 'mef-ui',
    exposedModule: './Button'
  });
  // Lógica fuertemente acoplada
}
```

**Con Wrapper (✅ Mantiene arquitectura):**

```typescript
// Componente usa abstracción local
<mef-button-wrapper
  variant="filled"
  textButton="Guardar"
  (onClick)="guardar()">
</mef-button-wrapper>

// El wrapper maneja los detalles de carga
// El componente solo conoce la interfaz del wrapper
```

---

## 💡 Ejemplos Prácticos

### Ejemplo 1: Flujo Completo (Crear Usuario)

```
1. Usuario hace clic en botón "Crear Usuario" (UI Layer)
   ↓
2. MefButtonWrapperComponent emite evento onClick
   ↓
3. CreateUserComponent ejecuta createUser()
   ↓
4. Component llama a CreateUserUseCase (Application Layer)
   ↓
5. UseCase crea entidad User (Domain Layer)
   ↓
6. UseCase guarda via UserRepositoryPort
   ↓
7. HttpUserRepository implementa el puerto (Adapters Layer)
   ↓
8. HTTP request a backend
   ↓
9. Resultado regresa por las mismas capas
   ↓
10. UI se actualiza con nuevo usuario
```

### Ejemplo 2: Cambiar de HTTP a LocalStorage

**Ventaja de Hexagonal:** Cambiar implementación sin tocar lógica.

```typescript
// ANTES: Usar HTTP
providers: [
  { provide: 'UserRepositoryPort', useClass: HttpUserRepository }
]

// DESPUÉS: Usar LocalStorage (misma interfaz, diferente implementación)
providers: [
  { provide: 'UserRepositoryPort', useClass: LocalStorageUserRepository }
]

// ✅ NINGÚN caso de uso necesita cambiar
// ✅ NINGÚN componente necesita cambiar
// ✅ Solo cambia la configuración de DI
```

---

## ⚖️ Ventajas y Desventajas

### ✅ Ventajas

1. **Testabilidad**
   - Lógica de negocio se testea sin dependencias externas
   - Puertos se mockean fácilmente

2. **Mantenibilidad**
   - Cambios en UI no afectan lógica de negocio
   - Cambios en infraestructura no afectan casos de uso

3. **Flexibilidad**
   - Fácil cambiar implementaciones (HTTP → LocalStorage)
   - Fácil agregar nuevos adaptadores

4. **Independencia del Framework**
   - Lógica de dominio no depende de Angular
   - Se puede portar a otro framework

5. **Escalabilidad**
   - Equipos pueden trabajar en capas independientes
   - Fácil agregar nuevas funcionalidades

### ❌ Desventajas

1. **Complejidad Inicial**
   - Más archivos y estructura
   - Curva de aprendizaje

2. **Overhead**
   - Mappers entre DTOs y entidades
   - Interfaces para todo

3. **No Siempre Necesario**
   - Para apps simples puede ser overkill
   - CRUD básicos no necesitan tanta abstracción

---

## 📚 Recursos Adicionales

- [Guía de Integración MEF UI](./01-GUIA-INTEGRACION-MEF-UI.md)
- [Native Federation](./03-NATIVE-FEDERATION.md)
- [Patrón Wrapper](./04-PATRON-WRAPPER.md)

### Lecturas Recomendadas

- [Hexagonal Architecture - Alistair Cockburn](https://alistair.cockburn.us/hexagonal-architecture/)
- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design - Eric Evans](https://martinfowler.com/tags/domain%20driven%20design.html)

---

**Última actualización:** 3 de Octubre, 2025
