import { Injectable, inject } from '@angular/core';
import { EventBusPort } from '../ports/event-bus.port';
import { EventHandler } from '../handlers/event-handler.interface';
import { UserCreatedHandler } from '../handlers/user-created.handler';
import { ProductReservedHandler } from '../handlers/product-reserved.handler';
import { LoggingPort } from '../ports/logging.port';

/**
 * Servicio que registra automáticamente todos los Event Handlers
 * Implementa el patrón Registry para Event-Driven Architecture
 */
@Injectable({
  providedIn: 'root'
})
export class EventHandlerRegistryService {
  private eventBus = inject(EventBusPort);
  private logger = inject(LoggingPort);
  private handlers: EventHandler<any>[] = [];
  private registeredHandlers = new Set<string>();

  constructor(
    private userCreatedHandler: UserCreatedHandler,
    private productReservedHandler: ProductReservedHandler
  ) {
    this.initializeHandlers();
  }

  /**
   * Inicializa y registra todos los event handlers
   */
  private initializeHandlers(): void {
    this.handlers = [
      this.userCreatedHandler,
      this.productReservedHandler
    ];

    this.logger.info(`🎯 Registrando ${this.handlers.length} event handlers...`);
    
    this.handlers.forEach(handler => {
      this.registerHandler(handler);
    });

    this.logger.info(`✅ Todos los event handlers registrados exitosamente`, {
      registeredTypes: Array.from(this.registeredHandlers)
    });
  }

  /**
   * Registra un handler específico con el event bus
   */
  private registerHandler<T>(handler: EventHandler<T>): void {
    if (this.registeredHandlers.has(handler.eventType)) {
      this.logger.warn(`⚠️ Handler para ${handler.eventType} ya está registrado`);
      return;
    }

    const unsubscribe = this.eventBus.subscribe(
      handler.eventType,
      async (event) => {
        try {
          this.logger.info(`🎯 Ejecutando handler para ${handler.eventType}`, {
            eventId: event.aggregateId,
            handlerName: handler.constructor.name
          });

          await handler.handle(event);

          this.logger.info(`✅ Handler ${handler.constructor.name} ejecutado exitosamente`);
        } catch (error) {
          this.logger.error(`❌ Error en handler ${handler.constructor.name}:`, {
            eventType: handler.eventType,
            error: error instanceof Error ? error.message : String(error)
          });
          
          // En producción: enviar a sistema de monitoring/alertas
          throw error;
        }
      }
    );

    this.registeredHandlers.add(handler.eventType);
    
    this.logger.info(`📝 Handler registrado: ${handler.eventType} -> ${handler.constructor.name}`);
  }

  /**
   * Obtiene lista de handlers registrados
   */
  getRegisteredHandlers(): string[] {
    return Array.from(this.registeredHandlers);
  }

  /**
   * Verifica si un tipo de evento tiene handler registrado
   */
  hasHandler(eventType: string): boolean {
    return this.registeredHandlers.has(eventType);
  }

  /**
   * Información de debug sobre handlers registrados
   */
  getHandlerInfo(): Array<{eventType: string, handlerName: string}> {
    return this.handlers.map(handler => ({
      eventType: handler.eventType,
      handlerName: handler.constructor.name
    }));
  }
}