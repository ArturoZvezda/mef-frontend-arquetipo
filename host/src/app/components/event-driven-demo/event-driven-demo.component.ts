import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EVENT_BUS_TOKEN, UserCreatedEvent, ProductReservedEvent, EventHandlerRegistryService } from '@mef-frontend-arquetipo/application';

@Component({
  selector: 'app-event-driven-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card animate-fade-in">
      <div class="flex items-center mb-6">
        <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center mr-4">
          📡
        </div>
        <div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">Event-Driven Design</h3>
          <p class="text-gray-600 dark:text-gray-300">Sistema de eventos del dominio en tiempo real</p>
        </div>
      </div>

      <!-- Event Handlers Info -->
      <div class="mb-6">
        <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          🎯 Event Handlers Registrados
        </h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          @for (handler of registeredHandlers; track handler.eventType) {
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div class="text-sm font-medium text-gray-900 dark:text-white">
                {{ handler.eventType }}
              </div>
              <div class="text-xs text-gray-600 dark:text-gray-400">
                {{ handler.handlerName }}
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Recent Events Log -->
      <div class="mb-6">
        <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          📜 Eventos Recientes
        </h4>
        <div class="max-h-64 overflow-y-auto space-y-2">
          @if (eventLog.length === 0) {
            <div class="text-center py-8 text-gray-500 dark:text-gray-400">
              <div class="text-4xl mb-2">📭</div>
              <p>No hay eventos registrados aún</p>
              <p class="text-sm">Los eventos aparecerán aquí cuando se publiquen</p>
            </div>
          }
          @for (event of eventLog; track event.id) {
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ getEventIcon(event.type) }} {{ event.type }}
                </span>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatTime(event.timestamp) }}
                </span>
              </div>
              <div class="text-xs text-gray-600 dark:text-gray-400 font-mono">
                ID: {{ event.aggregateId }}
              </div>
              @if (event.payload) {
                <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {{ formatPayload(event.payload) }}
                </div>
              }
            </div>
          }
        </div>
      </div>

      <!-- Demo Actions -->
      <div class="space-y-3">
        <h4 class="text-lg font-semibold text-gray-900 dark:text-white">
          🧪 Probar Eventos
        </h4>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            (click)="publishUserCreatedEvent()"
            [disabled]="isLoading"
            class="btn-primary text-sm disabled:opacity-50">
            @if (isLoading) {
              <div class="loading-spinner mr-2"></div>
            }
            👤 Simular User Created
          </button>

          <button
            (click)="publishProductReservedEvent()"
            [disabled]="isLoading"
            class="btn-secondary text-sm disabled:opacity-50">
            @if (isLoading) {
              <div class="loading-spinner mr-2"></div>
            }
            📦 Simular Product Reserved
          </button>
        </div>

        <button
          (click)="clearEventLog()"
          class="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg text-sm transition-colors">
          🗑️ Limpiar Log de Eventos
        </button>
      </div>

      <!-- Event Bus Stats -->
      <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div class="grid grid-cols-3 gap-4 text-center">
          <div>
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {{ eventLog.length }}
            </div>
            <div class="text-xs text-gray-600 dark:text-gray-400">Eventos Total</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-green-600 dark:text-green-400">
              {{ registeredHandlers.length }}
            </div>
            <div class="text-xs text-gray-600 dark:text-gray-400">Handlers</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {{ eventTypes.size }}
            </div>
            <div class="text-xs text-gray-600 dark:text-gray-400">Tipos</div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EventDrivenDemoComponent implements OnInit, OnDestroy {
  private eventBus = inject(EVENT_BUS_TOKEN);
  private handlerRegistry = inject(EventHandlerRegistryService);

  eventLog: Array<{
    id: string;
    type: string;
    timestamp: Date;
    aggregateId: string;
    payload: any;
  }> = [];

  registeredHandlers: Array<{eventType: string, handlerName: string}> = [];
  eventTypes = new Set<string>();
  isLoading = false;

  private unsubscribeCallbacks: (() => void)[] = [];

  ngOnInit() {
    this.loadHandlerInfo();
    this.subscribeToAllEvents();
  }

  ngOnDestroy() {
    this.unsubscribeCallbacks.forEach(unsubscribe => unsubscribe());
  }

  private loadHandlerInfo() {
    this.registeredHandlers = this.handlerRegistry.getHandlerInfo();
  }

  private subscribeToAllEvents() {
    // Suscribirse a todos los tipos de eventos para logging
    const eventTypes = ['USER_CREATED', 'PRODUCT_RESERVED', 'PRODUCT_STOCK_UPDATED'];
    
    eventTypes.forEach(eventType => {
      const unsubscribe = this.eventBus.subscribe(eventType, (event) => {
        this.addEventToLog(event);
      });
      this.unsubscribeCallbacks.push(unsubscribe);
    });
  }

  private addEventToLog(event: any) {
    this.eventLog.unshift({
      id: crypto.randomUUID(),
      type: event.type,
      timestamp: new Date(),
      aggregateId: event.aggregateId,
      payload: event.payload
    });

    this.eventTypes.add(event.type);

    // Mantener solo los últimos 20 eventos
    if (this.eventLog.length > 20) {
      this.eventLog = this.eventLog.slice(0, 20);
    }
  }

  async publishUserCreatedEvent() {
    this.isLoading = true;
    
    try {
      const event: UserCreatedEvent = {
        type: 'USER_CREATED',
        occurredOn: new Date(),
        aggregateId: crypto.randomUUID(),
        payload: {
          userId: crypto.randomUUID(),
          email: 'demo@mef.gob.pe',
          name: `Usuario Demo ${Math.floor(Math.random() * 1000)}`
        }
      };

      await this.eventBus.publish(event);
      
      // Simular tiempo de procesamiento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error('Error publishing USER_CREATED event:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async publishProductReservedEvent() {
    this.isLoading = true;
    
    try {
      const event: ProductReservedEvent = {
        type: 'PRODUCT_RESERVED',
        occurredOn: new Date(),
        aggregateId: crypto.randomUUID(),
        payload: {
          productId: `PROD-${Math.floor(Math.random() * 1000)}`,
          quantity: Math.floor(Math.random() * 5) + 1,
          userId: crypto.randomUUID()
        }
      };

      await this.eventBus.publish(event);
      
      // Simular tiempo de procesamiento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error('Error publishing PRODUCT_RESERVED event:', error);
    } finally {
      this.isLoading = false;
    }
  }

  clearEventLog() {
    this.eventLog = [];
    this.eventTypes.clear();
  }

  getEventIcon(eventType: string): string {
    const icons: Record<string, string> = {
      'USER_CREATED': '👤',
      'PRODUCT_RESERVED': '📦',
      'PRODUCT_STOCK_UPDATED': '📊'
    };
    return icons[eventType] || '📡';
  }

  formatTime(timestamp: Date): string {
    return timestamp.toLocaleTimeString('es-PE', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  formatPayload(payload: any): string {
    if (!payload) return '';
    
    const formatted = Object.entries(payload)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
    
    return formatted.length > 80 ? formatted.substring(0, 80) + '...' : formatted;
  }
}