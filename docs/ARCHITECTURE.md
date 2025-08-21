# Documentación de Arquitectura - MEF Frontend

## 🎯 Visión General

Este documento describe la arquitectura del frontend MEF basada en **Domain-Driven Design (DDD)** y **Arquitectura Hexagonal**, implementada con Angular 18 LTS y Nx.

---

## 🏗️ Principios Arquitectónicos

### 1. Separación de Responsabilidades (SRP)
Cada capa tiene una responsabilidad específica:
- **Domain**: Lógica de negocio pura
- **Application**: Orquestación de casos de uso
- **Infrastructure**: Detalles técnicos (HTTP, Storage)
- **Presentation**: Interfaz de usuario

### 2. Inversión de Dependencias (DIP)
Las capas internas no dependen de las externas:
```
Domain ← Application ← Infrastructure
   ↑                        ↑
   └─── Presentation ────────┘
```

### 3. Testabilidad
- Mocking sencillo gracias a interfaces (puertos)
- Tests unitarios sin dependencias externas
- Tests de integración controlados

---

## 📦 Capas de la Arquitectura

### 🎯 Domain Layer (`libs/domain`)

**Características**:
- Sin dependencias externas
- Contiene la lógica de negocio pura
- Inmutable y determinística

**Componentes**:

#### Entidades (Entities)
```typescript
// User Entity - Contiene identidad y comportamiento
export class User {
  constructor(
    private readonly id: UserId,
    private readonly email: Email,
    private readonly name: string
  ) {}

  // Regla de negocio
  isActive(): boolean {
    // Lógica de negocio
  }
}
```

#### Value Objects
```typescript
// Email Value Object - Sin identidad, inmutable
export class Email {
  private constructor(private readonly value: string) {
    if (!this.isValid(value)) {
      throw new Error(`Invalid email: ${value}`);
    }
  }

  static fromString(email: string): Email {
    return new Email(email.toLowerCase().trim());
  }
}
```

#### Domain Errors
```typescript
export class UserNotFoundError extends DomainError {
  readonly code = 'USER_NOT_FOUND';
  
  constructor(userId: string) {
    super(`User with id ${userId} not found`);
  }
}
```

### 🔧 Application Layer (`libs/application`)

**Características**:
- Orquesta la lógica de dominio
- Define puertos (interfaces)
- No contiene lógica de negocio

**Componentes**:

#### Puertos (Ports)
```typescript
// Puerto para repositorio - Define el contrato
export interface UserRepositoryPort {
  findById(id: UserId): Promise<User | null>;
  save(user: User): Promise<void>;
  findByEmail(email: Email): Promise<User | null>;
}

// Puerto para notificaciones
export interface NotificationPort {
  sendWelcomeEmail(user: User): Promise<void>;
}
```

#### Casos de Uso (Use Cases)
```typescript
export class CreateUserUseCase {
  constructor(
    private userRepository: UserRepositoryPort,
    private notification: NotificationPort
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    // 1. Validar datos de entrada
    const email = Email.fromString(command.email);
    
    // 2. Verificar reglas de negocio
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new UserAlreadyExistsError(email.getValue());
    }

    // 3. Crear entidad de dominio
    const user = new User(
      UserId.generate(),
      email,
      command.name
    );

    // 4. Persistir
    await this.userRepository.save(user);

    // 5. Efectos secundarios
    await this.notification.sendWelcomeEmail(user);

    return user;
  }
}
```

### 🔌 Infrastructure Layer (`libs/adapters`)

**Características**:
- Implementa los puertos definidos en Application
- Contiene detalles técnicos
- Puede cambiar sin afectar el dominio

**Componentes**:

#### HTTP Adapters
```typescript
@Injectable()
export class HttpUserRepository implements UserRepositoryPort {
  constructor(private http: HttpClient) {}

  async findById(id: UserId): Promise<User | null> {
    try {
      const response = await this.http
        .get<UserApiResponse>(`/api/users/${id.getValue()}`)
        .toPromise();
      
      return User.fromApiResponse(response);
    } catch (error) {
      if (error.status === 404) return null;
      throw error;
    }
  }

  async save(user: User): Promise<void> {
    const payload = UserMapper.toApiPayload(user);
    await this.http.post('/api/users', payload).toPromise();
  }
}
```

#### Storage Adapters
```typescript
@Injectable()
export class LocalStorageUserRepository implements UserRepositoryPort {
  private readonly STORAGE_KEY = 'mef_users';

  async findById(id: UserId): Promise<User | null> {
    const users = this.getAllUsers();
    const userData = users.find(u => u.id === id.getValue());
    return userData ? User.fromData(userData) : null;
  }

  private getAllUsers(): UserData[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }
}
```

### 🎨 Presentation Layer (`apps/host`, `apps/catalog`)

**Características**:
- Componentes Angular standalone
- Usa casos de uso de la capa Application
- Maneja estado local con Signals

**Componentes**:

#### Components
```typescript
@Component({
  selector: 'app-user-form',
  standalone: true,
  template: `
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
      <input formControlName="name" placeholder="Name" />
      <input formControlName="email" placeholder="Email" />
      <button type="submit" [disabled]="isLoading()">
        Create User
      </button>
    </form>
    
    @if (error()) {
      <div class="error">{{ error() }}</div>
    }
  `
})
export class UserFormComponent {
  private createUserUseCase = inject(CreateUserUseCase);
  
  userForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

  isLoading = signal(false);
  error = signal<string | null>(null);

  async onSubmit() {
    if (this.userForm.valid) {
      this.isLoading.set(true);
      this.error.set(null);

      try {
        const command = this.userForm.value as CreateUserCommand;
        await this.createUserUseCase.execute(command);
        
        // Éxito - resetear formulario
        this.userForm.reset();
      } catch (error) {
        this.error.set(error.message);
      } finally {
        this.isLoading.set(false);
      }
    }
  }
}
```

---

## 🔄 Flujo de Datos

### 1. Request Flow (Usuario → Sistema)
```
User Input → Component → Use Case → Domain → Repository → Database
```

### 2. Response Flow (Sistema → Usuario)
```
Database → Repository → Use Case → Component → User Interface
```

### 3. Error Flow
```
Any Layer → Domain Error → Use Case → Component → User Feedback
```

---

## 🧪 Testing Strategy

### Domain Layer Tests
```typescript
describe('User Entity', () => {
  it('should create a valid user', () => {
    const user = new User(
      UserId.generate(),
      Email.fromString('test@example.com'),
      'Test User'
    );

    expect(user.isActive()).toBe(true);
  });

  it('should throw error for invalid email', () => {
    expect(() => {
      Email.fromString('invalid-email');
    }).toThrow('Invalid email format');
  });
});
```

### Application Layer Tests
```typescript
describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockUserRepository: jest.Mocked<UserRepositoryPort>;
  let mockNotification: jest.Mocked<NotificationPort>;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      findByEmail: jest.fn()
    };
    mockNotification = {
      sendWelcomeEmail: jest.fn()
    };

    useCase = new CreateUserUseCase(
      mockUserRepository,
      mockNotification
    );
  });

  it('should create user successfully', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.save.mockResolvedValue();
    mockNotification.sendWelcomeEmail.mockResolvedValue();

    const command = {
      name: 'Test User',
      email: 'test@example.com'
    };

    const result = await useCase.execute(command);

    expect(result).toBeInstanceOf(User);
    expect(mockUserRepository.save).toHaveBeenCalled();
    expect(mockNotification.sendWelcomeEmail).toHaveBeenCalled();
  });
});
```

---

## 📋 Patrones Implementados

### 1. Repository Pattern
- Abstrae el acceso a datos
- Permite intercambiar implementaciones
- Facilita testing con mocks

### 2. Use Case Pattern
- Encapsula lógica de aplicación
- Una responsabilidad por use case
- Fácil de testear y mantener

### 3. Value Object Pattern
- Inmutabilidad
- Validación en construcción
- Igualdad por valor

### 4. Domain Error Pattern
- Errores tipados del dominio
- Información específica del contexto
- Fácil manejo en capas superiores

### 5. Dependency Injection
- Inversión de control
- Configuración en composition root
- Testabilidad mejorada

---

## 🎯 Beneficios de esta Arquitectura

1. **Mantenibilidad**: Código organizado y fácil de modificar
2. **Testabilidad**: Testing aislado por capas
3. **Escalabilidad**: Fácil agregar nuevas funcionalidades
4. **Flexibilidad**: Intercambio de implementaciones
5. **Claridad**: Separación clara de responsabilidades