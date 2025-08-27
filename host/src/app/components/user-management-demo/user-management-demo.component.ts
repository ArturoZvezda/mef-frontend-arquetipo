import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  CreateUserUseCase, 
  ActivateUserUseCase, 
  GetUsersUseCase,
  UserDto,
  EVENT_BUS_TOKEN,
  UserCreatedEvent,
  UserActivatedEvent 
} from '@mef-frontend-arquetipo/application';

interface UserDemoData extends UserDto {
  loading?: boolean;
}

@Component({
  selector: 'app-user-management-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card animate-fade-in">
      <div class="flex items-center mb-6">
        <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center mr-4">
          👥
        </div>
        <div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">Gestión de Usuarios</h3>
          <p class="text-gray-600 dark:text-gray-300">Demo completo de casos de uso DDD + Event-Driven</p>
        </div>
      </div>

      <!-- Formulario para crear usuario -->
      <div class="mb-6">
        <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          ➕ Crear Usuario
        </h4>
        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              [(ngModel)]="newUser.name"
              placeholder="Nombre completo"
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              [disabled]="isCreatingUser()">
            
            <input
              [(ngModel)]="newUser.email"
              placeholder="email@mef.gob.pe"
              type="email"
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              [disabled]="isCreatingUser()">
            
            <button
              (click)="createUser()"
              [disabled]="isCreatingUser() || !newUser.name || !newUser.email"
              class="btn-primary disabled:opacity-50">
              @if (isCreatingUser()) {
                <div class="loading-spinner mr-2"></div>
                Creando...
              } @else {
                ➕ Crear Usuario
              }
            </button>
          </div>
        </div>
      </div>

      <!-- Lista de usuarios -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-3">
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white">
            👤 Usuarios en el Sistema
          </h4>
          <button
            (click)="loadUsers()"
            [disabled]="isLoadingUsers()"
            class="btn-secondary text-sm">
            @if (isLoadingUsers()) {
              <div class="loading-spinner mr-2"></div>
            }
            🔄 Actualizar
          </button>
        </div>

        @if (isLoadingUsers()) {
          <div class="text-center py-8">
            <div class="loading-spinner mx-auto mb-2"></div>
            <p class="text-gray-600 dark:text-gray-400">Cargando usuarios...</p>
          </div>
        } @else if (users().length === 0) {
          <div class="text-center py-8 text-gray-500 dark:text-gray-400">
            <div class="text-4xl mb-2">👤</div>
            <p>No hay usuarios creados</p>
            <p class="text-sm">Crea el primer usuario para comenzar</p>
          </div>
        } @else {
          <div class="space-y-3">
            @for (user of users(); track user.id) {
              <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <div class="flex items-center mb-2">
                      <h5 class="font-medium text-gray-900 dark:text-white mr-3">{{ user.name }}</h5>
                      <span class="px-2 py-1 text-xs rounded-full"
                            [class]="getStatusBadgeClass(user.status)">
                        {{ getStatusLabel(user.status) }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">📧 {{ user.email }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-500">
                      ID: {{ user.id }} • Creado: {{ formatDate(user.createdAt) }}
                    </p>
                  </div>
                  
                  <div class="flex items-center space-x-2">
                    @if (user.status === 'PENDING') {
                      <button
                        (click)="activateUser(user)"
                        [disabled]="user.loading"
                        class="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm transition-colors disabled:opacity-50">
                        @if (user.loading) {
                          <div class="loading-spinner mr-1"></div>
                        }
                        ✅ Activar
                      </button>
                    }
                    
                    @if (user.status === 'ACTIVE') {
                      <span class="text-green-600 dark:text-green-400 text-sm">
                        ✅ Usuario Activo
                      </span>
                    }
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>

      <!-- Log de eventos -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-3">
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white">
            📡 Eventos en Tiempo Real
          </h4>
          <button
            (click)="clearEventLog()"
            class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            🗑️ Limpiar
          </button>
        </div>

        <div class="max-h-48 overflow-y-auto space-y-2">
          @if (eventLog().length === 0) {
            <div class="text-center py-4 text-gray-500 dark:text-gray-400">
              <p class="text-sm">Los eventos aparecerán aquí...</p>
            </div>
          }
          
          @for (event of eventLog(); track event.id) {
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ getEventIcon(event.type) }} {{ event.type }}
                </span>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatTime(event.timestamp) }}
                </span>
              </div>
              <div class="text-xs text-gray-600 dark:text-gray-400">
                {{ event.description }}
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Estadísticas -->
      <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
        <div class="grid grid-cols-4 gap-4 text-center">
          <div>
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {{ users().length }}
            </div>
            <div class="text-xs text-gray-600 dark:text-gray-400">Total</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {{ getPendingUsersCount() }}
            </div>
            <div class="text-xs text-gray-600 dark:text-gray-400">Pendientes</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-green-600 dark:text-green-400">
              {{ getActiveUsersCount() }}
            </div>
            <div class="text-xs text-gray-600 dark:text-gray-400">Activos</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {{ eventLog().length }}
            </div>
            <div class="text-xs text-gray-600 dark:text-gray-400">Eventos</div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UserManagementDemoComponent implements OnInit, OnDestroy {
  private createUserUseCase = inject(CreateUserUseCase);
  private activateUserUseCase = inject(ActivateUserUseCase);
  private getUsersUseCase = inject(GetUsersUseCase);
  private eventBus = inject(EVENT_BUS_TOKEN);

  // Signals para estado reactivo
  users = signal<UserDemoData[]>([]);
  isLoadingUsers = signal(false);
  isCreatingUser = signal(false);
  eventLog = signal<Array<{
    id: string;
    type: string;
    timestamp: Date;
    description: string;
  }>>([]);

  // Datos del formulario
  newUser = {
    name: '',
    email: ''
  };

  private unsubscribeCallbacks: (() => void)[] = [];

  ngOnInit() {
    this.loadUsers();
    this.subscribeToEvents();
  }

  ngOnDestroy() {
    this.unsubscribeCallbacks.forEach(unsubscribe => unsubscribe());
  }

  private subscribeToEvents() {
    // Suscribirse a eventos de usuario
    const userCreatedSub = this.eventBus.subscribe('USER_CREATED', (event: UserCreatedEvent) => {
      this.addEventToLog('USER_CREATED', `Usuario creado: ${event.payload.name} (${event.payload.email})`);
      this.loadUsers(); // Recargar lista
    });

    const userActivatedSub = this.eventBus.subscribe('USER_ACTIVATED', (event: UserActivatedEvent) => {
      this.addEventToLog('USER_ACTIVATED', `Usuario activado: ${event.payload.name} por ${event.payload.activatedBy}`);
      this.loadUsers(); // Recargar lista
    });

    this.unsubscribeCallbacks.push(userCreatedSub, userActivatedSub);
  }

  async createUser() {
    if (!this.newUser.name || !this.newUser.email) return;

    this.isCreatingUser.set(true);
    
    try {
      await this.createUserUseCase.execute({
        name: this.newUser.name,
        email: this.newUser.email
      });

      // Limpiar formulario
      this.newUser = { name: '', email: '' };

    } catch (error) {
      console.error('Error creating user:', error);
      this.addEventToLog('ERROR', `Error creando usuario: ${error}`);
    } finally {
      this.isCreatingUser.set(false);
    }
  }

  async activateUser(user: UserDemoData) {
    // Actualizar estado local de loading
    this.users.update(users => 
      users.map(u => u.id === user.id ? { ...u, loading: true } : u)
    );

    try {
      await this.activateUserUseCase.execute({
        userId: user.id,
        activatedBy: 'admin-demo',
        reason: 'Activación desde demo de gestión'
      });

    } catch (error) {
      console.error('Error activating user:', error);
      this.addEventToLog('ERROR', `Error activando usuario ${user.name}: ${error}`);
    } finally {
      // Remover loading state
      this.users.update(users => 
        users.map(u => u.id === user.id ? { ...u, loading: false } : u)
      );
    }
  }

  async loadUsers() {
    this.isLoadingUsers.set(true);
    
    try {
      const result = await this.getUsersUseCase.execute({
        limit: 50,
        offset: 0
      });

      this.users.set(result.users);

    } catch (error) {
      console.error('Error loading users:', error);
      this.addEventToLog('ERROR', `Error cargando usuarios: ${error}`);
    } finally {
      this.isLoadingUsers.set(false);
    }
  }

  private addEventToLog(type: string, description: string) {
    this.eventLog.update(events => [
      {
        id: crypto.randomUUID(),
        type,
        timestamp: new Date(),
        description
      },
      ...events.slice(0, 19) // Mantener solo los últimos 20
    ]);
  }

  clearEventLog() {
    this.eventLog.set([]);
  }

  getStatusBadgeClass(status: string): string {
    const classes = {
      'PENDING': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'ACTIVE': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'SUSPENDED': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

  getStatusLabel(status: string): string {
    const labels = {
      'PENDING': 'Pendiente',
      'ACTIVE': 'Activo',
      'SUSPENDED': 'Suspendido'
    };
    return labels[status as keyof typeof labels] || status;
  }

  getEventIcon(eventType: string): string {
    const icons = {
      'USER_CREATED': '👤',
      'USER_ACTIVATED': '✅',
      'ERROR': '❌'
    };
    return icons[eventType as keyof typeof icons] || '📡';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatTime(timestamp: Date): string {
    return timestamp.toLocaleTimeString('es-PE', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  getPendingUsersCount(): number {
    return this.users().filter(user => user.status === 'PENDING').length;
  }

  getActiveUsersCount(): number {
    return this.users().filter(user => user.status === 'ACTIVE').length;
  }
}