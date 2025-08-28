# 🔗 Integración Frontend-Backend: Microfrontends + Arquitectura Hexagonal

## 📋 Análisis de la Infraestructura Actual

### 🎯 **Backend: Arquetipo MEF (Java + Spring Boot)**

**Ubicación:** `C:\dev\mef\arquetipo-back`

**Arquitectura implementada:**
- ✅ **Arquitectura Hexagonal** (Puertos y Adaptadores)
- ✅ **Domain-Driven Design (DDD)**  
- ✅ **Spring Boot 3.x**
- ✅ **Spring Security + OAuth2/JWT**
- ✅ **Oracle Database**
- ✅ **API REST documentada con OpenAPI/Swagger**

### 🎨 **Frontend: MEF Frontend Arquetipo (Angular 18)**

**Ubicación:** `C:\dev\mef\mef-frontend-arquetipo`

**Arquitectura implementada:**
- ✅ **Arquitectura Hexagonal** + **DDD**
- ✅ **Event-Driven Architecture**  
- ✅ **Microfrontends** con Native Federation
- ✅ **Angular 18 LTS** + Standalone Components
- ✅ **TypeScript 5.3** + Signals

---

## 🚀 Plan de Integración Completo

### Fase 1: Configuración Base de Integración

#### 1.1 **Configurar HTTP Client en Frontend**

```typescript
// adapters/src/lib/http/mef-backend-http-client.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../shared/src/lib/config/environment';

@Injectable({
  providedIn: 'root'
})
export class MefBackendHttpClient {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.mefBackendUrl; // http://localhost:8080/v1/siafrp-services/arquetipo

  /**
   * Cliente HTTP específico para comunicación con backend MEF
   * Incluye configuración de headers, autenticación y manejo de errores
   */
  
  // GET con parámetros de paginación
  get<T>(endpoint: string, params?: any): Observable<T> {
    const httpParams = this.buildHttpParams(params);
    const headers = this.getAuthHeaders();
    
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, {
      headers,
      params: httpParams
    });
  }

  // POST para crear recursos
  post<T>(endpoint: string, body: any): Observable<T> {
    const headers = this.getAuthHeaders();
    
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body, {
      headers
    });
  }

  // DELETE para eliminar recursos
  delete<T>(endpoint: string, params?: any): Observable<T> {
    const httpParams = this.buildHttpParams(params);
    const headers = this.getAuthHeaders();
    
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, {
      headers,
      params: httpParams
    });
  }

  // Configuración de headers con autenticación
  private getAuthHeaders(): HttpHeaders {
    // TODO: Implementar obtención del token JWT desde el servicio de autenticación
    const token = this.getJwtToken(); // Por implementar
    
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // Construcción de parámetros HTTP
  private buildHttpParams(params?: any): HttpParams {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }
    
    return httpParams;
  }

  private getJwtToken(): string | null {
    // TODO: Integrar con servicio de autenticación
    // Por ahora retorna null, se debe implementar según el flujo OAuth2/JWT
    return localStorage.getItem('mef_jwt_token');
  }
}
```

#### 1.2 **Adaptar DTOs del Backend al Frontend**

```typescript
// domain/src/lib/entities/backend-usuario.entity.ts
import { Email } from '../value-objects/email.vo';
import { UserId } from '../value-objects/user-id.vo';
import { UserStatus } from './user.entity';

/**
 * Entidad Usuario adaptada al formato del backend MEF
 * Mapea los campos del UsuarioDto de Java
 */
export class BackendUsuario {
  constructor(
    private readonly id: UserId,
    private readonly documento: string,
    private readonly idUsuario: string,
    private readonly nombre: string,
    private readonly apellido: string,
    private readonly segundoApellido: string,
    private readonly email: Email,
    private readonly activo: boolean,
    private readonly createdAt: Date = new Date()
  ) {}

  // Getters
  getId(): UserId { return this.id; }
  getDocumento(): string { return this.documento; }
  getIdUsuario(): string { return this.idUsuario; }
  getNombre(): string { return this.nombre; }
  getApellido(): string { return this.apellido; }
  getSegundoApellido(): string { return this.segundoApellido; }
  getEmail(): Email { return this.email; }
  isActivo(): boolean { return this.activo; }
  getCreatedAt(): Date { return this.createdAt; }

  // Nombre completo
  getNombreCompleto(): string {
    return `${this.nombre} ${this.apellido} ${this.segundoApellido}`.trim();
  }

  // Mapeo a UserStatus del frontend
  getStatus(): UserStatus {
    return this.activo ? UserStatus.ACTIVE : UserStatus.PENDING;
  }

  // Factory method desde backend DTO
  static fromBackendDto(dto: BackendUsuarioDto): BackendUsuario {
    return new BackendUsuario(
      dto.id ? UserId.fromString(dto.id.toString()) : UserId.generate(),
      dto.documento || '',
      dto.idUsuario || '',
      dto.nombre || '',
      dto.apellido || '',
      dto.segundoApellido || '',
      Email.fromString(dto.correoElectronico || ''),
      dto.activo ?? false
    );
  }

  // Mapeo a backend DTO
  toBackendDto(): BackendUsuarioDto {
    return {
      id: this.id.getValue() ? parseInt(this.id.getValue()) : undefined,
      documento: this.documento,
      idUsuario: this.idUsuario,
      nombre: this.nombre,
      apellido: this.apellido,
      segundoApellido: this.segundoApellido,
      correoElectronico: this.email.getValue(),
      activo: this.activo
    };
  }
}

// DTOs de backend (mapean exactamente a los de Java)
export interface BackendUsuarioDto {
  id?: number;
  documento?: string;
  idUsuario?: string;
  nombre?: string;
  apellido?: string;
  segundoApellido?: string;
  correoElectronico?: string;
  activo?: boolean;
}

export interface BackendWebResponse<T> {
  result: T;
  success: boolean;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
}

export interface BackendPaginatedResponse<T> {
  totalCount: number;
  items: T[];
}
```

#### 1.3 **Repositorio HTTP para Backend MEF**

```typescript
// adapters/src/lib/http/mef-backend-user.repository.ts
import { Injectable, inject } from '@angular/core';
import { Observable, map, catchError } from 'rxjs';
import { UserRepositoryPort } from '@mef-frontend-arquetipo/application';
import { User, UserId, Email } from '@mef-frontend-arquetipo/domain';
import { MefBackendHttpClient } from './mef-backend-http-client.service';
import { 
  BackendUsuario, 
  BackendUsuarioDto, 
  BackendWebResponse,
  BackendPaginatedResponse 
} from '../../domain/src/lib/entities/backend-usuario.entity';

@Injectable({
  providedIn: 'root'
})
export class MefBackendUserRepository implements UserRepositoryPort {
  private httpClient = inject(MefBackendHttpClient);

  /**
   * Implementación del repositorio de usuarios que se conecta al backend MEF
   * Traduce entre el modelo de dominio del frontend y los DTOs del backend
   */

  // Buscar usuario por ID
  async findById(id: UserId): Promise<User | null> {
    try {
      // El backend no tiene endpoint por ID individual, usar búsqueda paginada
      const response = await this.findAll(1, 0, { idUsuario: id.getValue() });
      return response.users.length > 0 ? response.users[0] : null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
  }

  // Buscar usuario por email
  async findByEmail(email: Email): Promise<User | null> {
    try {
      const response = await this.findAll(1, 0, { emailAddress: email.getValue() });
      return response.users.length > 0 ? response.users[0] : null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  // Obtener usuarios paginados
  async findAll(limit: number, offset: number, filters?: any): Promise<{ users: User[], total: number, hasMore: boolean }> {
    try {
      const params = {
        max_result_count: limit,
        skip_count: offset,
        sorting: 'nombre ASC',
        ...filters
      };

      const response = await this.httpClient.get<BackendWebResponse<BackendPaginatedResponse<BackendUsuarioDto>>>(
        '/usuarios/paginado',
        params
      ).toPromise();

      if (!response?.success || !response.result) {
        return { users: [], total: 0, hasMore: false };
      }

      const users = response.result.items.map(dto => this.mapBackendDtoToUser(dto));
      const total = response.result.totalCount;
      const hasMore = (offset + limit) < total;

      return { users, total, hasMore };
    } catch (error) {
      console.error('Error fetching users:', error);
      return { users: [], total: 0, hasMore: false };
    }
  }

  // Crear usuario
  async save(user: User): Promise<User> {
    try {
      // Mapear User del frontend a BackendUsuario
      const backendUser = this.mapUserToBackendUser(user);
      const dto = backendUser.toBackendDto();

      const response = await this.httpClient.post<BackendWebResponse<BackendUsuarioDto>>(
        '/usuarios',
        dto
      ).toPromise();

      if (!response?.success || !response.result) {
        throw new Error('Failed to save user');
      }

      return this.mapBackendDtoToUser(response.result);
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }

  // Eliminar usuario
  async delete(id: UserId): Promise<void> {
    try {
      await this.httpClient.delete('/usuarios', { id: parseInt(id.getValue()) }).toPromise();
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Mappers privados
  private mapBackendDtoToUser(dto: BackendUsuarioDto): User {
    const backendUser = BackendUsuario.fromBackendDto(dto);
    
    // Convertir BackendUsuario a User del frontend
    return new User(
      backendUser.getId(),
      backendUser.getEmail(),
      backendUser.getNombreCompleto(),
      backendUser.getStatus(),
      backendUser.getCreatedAt()
    );
  }

  private mapUserToBackendUser(user: User): BackendUsuario {
    // Convertir User del frontend a BackendUsuario
    const [nombre, apellido = '', segundoApellido = ''] = user.getName().split(' ');
    
    return new BackendUsuario(
      user.getId(),
      '', // documento - no disponible en User del frontend
      user.getId().getValue(), // usar ID como idUsuario
      nombre,
      apellido,
      segundoApellido,
      user.getEmail(),
      user.isActive(),
      user.getCreatedAt()
    );
  }
}
```

### Fase 2: Configuración de Ambiente

#### 2.1 **Variables de Entorno**

```typescript
// shared/src/lib/config/environment.ts
export interface Environment {
  production: boolean;
  mefBackendUrl: string;
  mefBackendAuth: {
    tokenUrl: string;
    clientId: string;
    realm: string;
  };
  cors: {
    allowedOrigins: string[];
  };
}

export const environment: Environment = {
  production: false,
  mefBackendUrl: 'http://localhost:8080/v1/siafrp-services/arquetipo',
  mefBackendAuth: {
    tokenUrl: 'https://desa-iam-siafrp.mineco.gob.pe/auth/realms/mef-comp9/protocol/openid-connect/token',
    clientId: 'mef-frontend-client',
    realm: 'mef-comp9'
  },
  cors: {
    allowedOrigins: ['http://localhost:4200', 'http://localhost:4201']
  }
};

export const environmentProduction: Environment = {
  production: true,
  mefBackendUrl: 'https://api.mef.gob.pe/v1/siafrp-services/arquetipo',
  mefBackendAuth: {
    tokenUrl: 'https://iam-siafrp.mineco.gob.pe/auth/realms/mef-comp9/protocol/openid-connect/token',
    clientId: 'mef-frontend-client-prod',
    realm: 'mef-comp9'
  },
  cors: {
    allowedOrigins: ['https://frontend.mef.gob.pe']
  }
};
```

#### 2.2 **Configuración de HTTP Interceptors**

```typescript
// adapters/src/lib/http/mef-auth.interceptor.ts
import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { MefAuthService } from './mef-auth.service';

@Injectable()
export class MefAuthInterceptor implements HttpInterceptor {
  private authService = inject(MefAuthService);

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Solo interceptar requests al backend MEF
    if (!req.url.includes('siafrp-services/arquetipo')) {
      return next.handle(req);
    }

    return this.authService.getValidToken().pipe(
      switchMap(token => {
        // Agregar token JWT al header
        const authenticatedReq = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
        
        return next.handle(authenticatedReq);
      }),
      catchError((error: HttpErrorResponse) => {
        // Manejar errores de autenticación
        if (error.status === 401) {
          return this.authService.refreshToken().pipe(
            switchMap(newToken => {
              const retryReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${newToken}`)
              });
              return next.handle(retryReq);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}
```

### Fase 3: Autenticación y Seguridad

#### 3.1 **Servicio de Autenticación MEF**

```typescript
// adapters/src/lib/http/mef-auth.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../shared/src/lib/config/environment';

interface MefTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

@Injectable({
  providedIn: 'root'
})
export class MefAuthService {
  private http = inject(HttpClient);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private refreshTokenValue: string | null = null;

  /**
   * Servicio de autenticación para integración con Keycloak MEF
   * Maneja OAuth2/JWT tokens y renovación automática
   */

  // Obtener token válido (renovar si es necesario)
  getValidToken(): Observable<string> {
    const currentToken = this.tokenSubject.value;
    
    if (currentToken && !this.isTokenExpired(currentToken)) {
      return new BehaviorSubject(currentToken).asObservable();
    }
    
    return this.refreshToken();
  }

  // Renovar token usando refresh_token
  refreshToken(): Observable<string> {
    if (!this.refreshTokenValue) {
      return throwError(() => new Error('No refresh token available'));
    }

    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', this.refreshTokenValue);
    params.append('client_id', environment.mefBackendAuth.clientId);

    return this.http.post<MefTokenResponse>(
      environment.mefBackendAuth.tokenUrl,
      params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    ).pipe(
      tap(response => {
        this.storeTokens(response);
      }),
      map(response => response.access_token),
      catchError(error => {
        console.error('Token refresh failed:', error);
        this.clearTokens();
        return throwError(() => error);
      })
    );
  }

  // Login con credenciales
  login(username: string, password: string): Observable<string> {
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('username', username);
    params.append('password', password);
    params.append('client_id', environment.mefBackendAuth.clientId);

    return this.http.post<MefTokenResponse>(
      environment.mefBackendAuth.tokenUrl,
      params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    ).pipe(
      tap(response => {
        this.storeTokens(response);
      }),
      map(response => response.access_token)
    );
  }

  // Almacenar tokens
  private storeTokens(response: MefTokenResponse): void {
    this.tokenSubject.next(response.access_token);
    this.refreshTokenValue = response.refresh_token;
    
    // Almacenar en localStorage con expiración
    const expirationTime = Date.now() + (response.expires_in * 1000);
    localStorage.setItem('mef_jwt_token', response.access_token);
    localStorage.setItem('mef_refresh_token', response.refresh_token);
    localStorage.setItem('mef_token_expiration', expirationTime.toString());
  }

  // Limpiar tokens
  private clearTokens(): void {
    this.tokenSubject.next(null);
    this.refreshTokenValue = null;
    localStorage.removeItem('mef_jwt_token');
    localStorage.removeItem('mef_refresh_token');
    localStorage.removeItem('mef_token_expiration');
  }

  // Verificar si token está expirado
  private isTokenExpired(token: string): boolean {
    try {
      const expiration = localStorage.getItem('mef_token_expiration');
      if (!expiration) return true;
      
      return Date.now() >= parseInt(expiration);
    } catch {
      return true;
    }
  }
}
```

### Fase 4: Casos de Uso Integrados

#### 4.1 **Caso de Uso con Backend Real**

```typescript
// application/src/lib/use-cases/user/create-mef-user.use-case.ts
import { Injectable } from '@angular/core';
import { MefBackendUserRepository } from '@mef-frontend-arquetipo/adapters';
import { User, Email, UserId } from '@mef-frontend-arquetipo/domain';
import { LoggingPort, EventBusPort, UserCreatedEvent } from '../../ports';

interface CreateMefUserCommand {
  documento: string;
  nombre: string;
  apellido: string;
  segundoApellido?: string;
  correoElectronico: string;
  idUsuario?: string;
}

/**
 * Caso de uso específico para crear usuarios en el backend MEF
 * Integra el dominio del frontend con la API real del backend
 */
@Injectable({
  providedIn: 'root'
})
export class CreateMefUserUseCase {
  private logger: LoggingPort;

  constructor(
    private mefUserRepository: MefBackendUserRepository,
    private eventBus: EventBusPort,
    loggingPort: LoggingPort
  ) {
    this.logger = loggingPort.withContext('CreateMefUserUseCase');
  }

  async execute(command: CreateMefUserCommand): Promise<User> {
    this.logger.info('Creating user in MEF backend', {
      documento: command.documento,
      email: command.correoElectronico
    });

    try {
      // 1. Validaciones de dominio
      const email = Email.fromString(command.correoElectronico);
      const userId = UserId.generate();
      const nombreCompleto = `${command.nombre} ${command.apellido} ${command.segundoApellido || ''}`.trim();

      // 2. Verificar que no exista usuario con mismo email
      const existingUser = await this.mefUserRepository.findByEmail(email);
      if (existingUser) {
        throw new Error(`User with email ${command.correoElectronico} already exists`);
      }

      // 3. Crear entidad de dominio
      const user = new User(
        userId,
        email,
        nombreCompleto,
        'PENDING', // El backend manejará la activación
        new Date()
      );

      // 4. Guardar en backend MEF
      const savedUser = await this.mefUserRepository.save(user);

      // 5. Publicar evento de dominio
      const userCreatedEvent: UserCreatedEvent = {
        type: 'USER_CREATED',
        occurredOn: new Date(),
        aggregateId: savedUser.getId().getValue(),
        payload: {
          userId: savedUser.getId().getValue(),
          email: savedUser.getEmail().getValue(),
          name: savedUser.getName(),
          source: 'MEF_BACKEND' // Indicar origen
        }
      };

      await this.eventBus.publish(userCreatedEvent);

      this.logger.info('User created successfully in MEF backend', {
        userId: savedUser.getId().getValue(),
        email: savedUser.getEmail().getValue()
      });

      return savedUser;

    } catch (error) {
      this.logger.error('Failed to create user in MEF backend', error as Error, {
        command
      });
      throw error;
    }
  }
}
```

### Fase 5: Microfrontend Específico para MEF

#### 5.1 **Microfrontend MEF-Admin**

```bash
# Crear nuevo microfrontend específico para MEF
cd mef-frontend-arquetipo
npx nx generate @nx/angular:application mef-admin
npx nx generate @nx/angular:setup-native-federation mef-admin --type=remote
```

```typescript
// mef-admin/src/app/components/mef-user-management/mef-user-management.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CreateMefUserUseCase } from '@mef-frontend-arquetipo/application';

@Component({
  selector: 'app-mef-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="mef-admin-container">
      <header class="mef-header">
        <h1>🏛️ MEF - Gestión de Usuarios</h1>
        <p>Administración integrada con backend SIAFRP</p>
      </header>

      <!-- Formulario integrado con backend -->
      <section class="mef-form-section">
        <form [formGroup]="userForm" (ngSubmit)="createUser()">
          <div class="form-grid">
            <div class="form-field">
              <label>Documento</label>
              <input formControlName="documento" placeholder="DNI/CE" maxlength="12">
            </div>
            
            <div class="form-field">
              <label>Nombre</label>
              <input formControlName="nombre" placeholder="Primer nombre">
            </div>
            
            <div class="form-field">
              <label>Apellido Paterno</label>
              <input formControlName="apellido" placeholder="Apellido paterno">
            </div>
            
            <div class="form-field">
              <label>Apellido Materno</label>
              <input formControlName="segundoApellido" placeholder="Apellido materno (opcional)">
            </div>
            
            <div class="form-field">
              <label>Correo Electrónico</label>
              <input formControlName="correoElectronico" type="email" placeholder="usuario@mef.gob.pe">
            </div>
            
            <div class="form-field">
              <label>ID Usuario</label>
              <input formControlName="idUsuario" placeholder="ID único del usuario (opcional)">
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" 
                    [disabled]="userForm.invalid || isLoading()"
                    class="btn-primary">
              @if (isLoading()) {
                <div class="spinner"></div> Creando...
              } @else {
                ➕ Crear Usuario MEF
              }
            </button>
          </div>
        </form>
      </section>

      <!-- Lista de usuarios del backend -->
      <section class="mef-users-section">
        <div class="section-header">
          <h2>👥 Usuarios SIAFRP</h2>
          <button (click)="loadUsers()" [disabled]="isLoadingUsers()" class="btn-secondary">
            🔄 Actualizar
          </button>
        </div>

        @if (isLoadingUsers()) {
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Cargando usuarios desde backend MEF...</p>
          </div>
        } @else if (mefUsers().length === 0) {
          <div class="empty-state">
            <p>No hay usuarios registrados</p>
          </div>
        } @else {
          <div class="users-grid">
            @for (user of mefUsers(); track user.id) {
              <div class="user-card">
                <div class="user-info">
                  <h3>{{ user.name }}</h3>
                  <p>📧 {{ user.email }}</p>
                  <p>🆔 {{ user.id }}</p>
                  <span class="status-badge" [class.active]="user.isActive">
                    {{ user.isActive ? 'Activo' : 'Inactivo' }}
                  </span>
                </div>
                <div class="user-actions">
                  @if (!user.isActive) {
                    <button (click)="activateUser(user)" class="btn-activate">
                      ✅ Activar
                    </button>
                  }
                  <button (click)="deleteUser(user)" class="btn-delete">
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            }
          </div>
        }
      </section>
    </div>
  `,
  styles: [`
    .mef-admin-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .mef-header {
      text-align: center;
      margin-bottom: 2rem;
      padding: 2rem;
      background: linear-gradient(135deg, #1e3a8a, #3b82f6);
      color: white;
      border-radius: 1rem;
    }
    
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    
    .users-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1rem;
    }
    
    .user-card {
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 1rem;
      background: white;
    }
    
    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.875rem;
      background: #fca5a5;
      color: #991b1b;
    }
    
    .status-badge.active {
      background: #86efac;
      color: #166534;
    }
    
    /* Más estilos... */
  `]
})
export class MefUserManagementComponent {
  private fb = inject(FormBuilder);
  private createMefUserUseCase = inject(CreateMefUserUseCase);

  // Signals para estado reactivo
  isLoading = signal(false);
  isLoadingUsers = signal(false);
  mefUsers = signal<any[]>([]);

  userForm = this.fb.group({
    documento: ['', [Validators.required, Validators.maxLength(12)]],
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    apellido: ['', [Validators.required, Validators.maxLength(100)]],
    segundoApellido: ['', Validators.maxLength(100)],
    correoElectronico: ['', [Validators.required, Validators.email]],
    idUsuario: ['', Validators.maxLength(50)]
  });

  ngOnInit() {
    this.loadUsers();
  }

  async createUser() {
    if (this.userForm.invalid) return;

    this.isLoading.set(true);
    try {
      const formValue = this.userForm.value;
      const user = await this.createMefUserUseCase.execute({
        documento: formValue.documento!,
        nombre: formValue.nombre!,
        apellido: formValue.apellido!,
        segundoApellido: formValue.segundoApellido || undefined,
        correoElectronico: formValue.correoElectronico!,
        idUsuario: formValue.idUsuario || undefined
      });

      console.log('✅ Usuario MEF creado:', user);
      this.userForm.reset();
      this.loadUsers(); // Recargar lista

    } catch (error) {
      console.error('❌ Error creando usuario MEF:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  async loadUsers() {
    // TODO: Implementar carga de usuarios desde backend MEF
    this.isLoadingUsers.set(true);
    // ... implementación
    this.isLoadingUsers.set(false);
  }

  async activateUser(user: any) {
    // TODO: Implementar activación de usuario
  }

  async deleteUser(user: any) {
    // TODO: Implementar eliminación de usuario
  }
}
```

### Fase 6: Configuración de Despliegue

#### 6.1 **Docker Compose para Desarrollo Local**

```yaml
# docker-compose.dev.yml
version: '3.8'
services:
  # Backend MEF
  mef-backend:
    build:
      context: ../arquetipo-back
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
      - "8100:8100"  # Management port
    environment:
      - SPRING_PROFILES_ACTIVE=local
      - ORACLE_CONN=oracle-db:1521
      - ORACLE_USERNAME=siafrp_arquetipo_obj
      - ORACLE_PASSWORD=siafr2025obj
    depends_on:
      - oracle-db
    networks:
      - mef-network

  # Oracle Database (para desarrollo)
  oracle-db:
    image: container-registry.oracle.com/database/free:latest
    ports:
      - "1521:1521"
    environment:
      - ORACLE_PWD=Oracle123
      - ORACLE_CHARACTERSET=AL32UTF8
    volumes:
      - oracle-data:/opt/oracle/oradata
    networks:
      - mef-network

  # Frontend Host
  mef-frontend-host:
    build:
      context: .
      dockerfile: Dockerfile.host
    ports:
      - "4200:4200"
    environment:
      - NODE_ENV=development
      - MEF_BACKEND_URL=http://mef-backend:8080/v1/siafrp-services/arquetipo
    volumes:
      - ./:/app
      - /app/node_modules
    networks:
      - mef-network

  # Microfrontend MEF-Admin
  mef-admin:
    build:
      context: .
      dockerfile: Dockerfile.mef-admin
    ports:
      - "4201:4201"
    environment:
      - NODE_ENV=development
    volumes:
      - ./:/app
      - /app/node_modules
    networks:
      - mef-network

volumes:
  oracle-data:

networks:
  mef-network:
    driver: bridge
```

#### 6.2 **Scripts de Desarrollo**

```json
// package.json - Scripts adicionales
{
  "scripts": {
    "dev:full-stack": "docker-compose -f docker-compose.dev.yml up",
    "dev:frontend": "concurrently \"npx nx serve host\" \"npx nx serve mef-admin\"",
    "dev:with-backend": "concurrently \"npx nx serve host\" \"npx nx serve mef-admin\" \"cd ../arquetipo-back && ./gradlew bootRun\"",
    "build:all": "npx nx run-many -t build --projects=host,mef-admin,domain,application,adapters",
    "test:integration": "npx nx run-many -t e2e --projects=host-e2e,mef-admin-e2e"
  }
}
```

---

## 🎯 Plan de Implementación por Fases

### ✅ **Fase 1: Fundación (Semana 1-2)**
- [x] Análisis de APIs del backend
- [x] Configuración de HTTP clients
- [x] Mapeo de DTOs backend ↔ frontend
- [x] Configuración de ambientes

### 🔄 **Fase 2: Integración Básica (Semana 3-4)**
- [ ] Implementar repositorios HTTP reales
- [ ] Integrar autenticación OAuth2/JWT
- [ ] Casos de uso con backend real
- [ ] Testing de integración

### 🚀 **Fase 3: Microfrontend MEF (Semana 5-6)**
- [ ] Crear microfrontend específico MEF
- [ ] UI integrada con backend
- [ ] Flujos completos de usuario
- [ ] Validaciones de negocio

### 🏭 **Fase 4: Producción (Semana 7-8)**
- [ ] Configuración de despliegue
- [ ] CI/CD pipelines
- [ ] Monitoring y observabilidad
- [ ] Documentación final

---

## 🔧 Comandos para Comenzar

```bash
# 1. Clonar y configurar frontend
cd C:\dev\mef\mef-frontend-arquetipo
npm install

# 2. Instalar dependencias adicionales para integración
npm install @angular/common/http

# 3. Levantar backend (en otra terminal)
cd C:\dev\mef\arquetipo-back
./gradlew bootRun

# 4. Levantar frontend con integración
npx nx serve host

# 5. Verificar integración
curl http://localhost:8080/v1/siafrp-services/arquetipo/usuarios/paginado
```

---

## 📊 Beneficios de esta Arquitectura

### 🎯 **Para el Negocio:**
- **Consistencia**: Mismo modelo de dominio en frontend y backend
- **Escalabilidad**: Equipos independientes por microfrontend
- **Flexibilidad**: Evolución independiente de cada capa
- **Mantenibilidad**: Código bien estructurado y testeable

### 🚀 **Para Desarrollo:**
- **DDD End-to-End**: Continuidad del modelo de dominio
- **Tipado fuerte**: TypeScript ↔ Java DTOs mapeados
- **Testing**: Casos de uso testeables en aislamiento
- **Observabilidad**: Logging y métricas integradas

### 🔒 **Para Seguridad:**
- **OAuth2/JWT**: Autenticación enterprise estándar
- **CORS configurado**: Seguridad entre dominios
- **Interceptors**: Manejo centralizado de autenticación
- **Validaciones**: En frontend y backend

Esta integración mantiene la filosofía de **Arquitectura Hexagonal + DDD** en ambos lados, permitiendo evolución independiente mientras se mantiene un modelo de dominio coherente! 🚀