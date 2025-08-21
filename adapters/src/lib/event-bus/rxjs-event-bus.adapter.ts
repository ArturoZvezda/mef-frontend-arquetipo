import { Injectable } from '@angular/core';
import { Subject, filter, map } from 'rxjs';
import { EventBusPort, DomainEvent } from '@mef-frontend-arquetipo/application';

/**
 * Implementación de Event Bus usando RxJS
 * Permite comunicación entre diferentes partes de la aplicación
 */
@Injectable({
  providedIn: 'root'
})
export class RxjsEventBusAdapter implements EventBusPort {
  private eventSubject = new Subject<DomainEvent>();
  private eventSubscriptions = new Map<string, () => void>();

  async publish<T extends DomainEvent>(event: T): Promise<void> {
    console.log(`📡 Publishing event: ${event.type}`, {
      aggregateId: event.aggregateId,
      occurredOn: event.occurredOn,
      payload: event.payload
    });

    // Emitir el evento
    this.eventSubject.next(event);

    // Simular delay de propagación
    await new Promise(resolve => setTimeout(resolve, 10));
  }

  subscribe<T extends DomainEvent>(
    eventType: string,
    handler: (event: T) => Promise<void> | void
  ): () => void {
    console.log(`🔔 Subscribing to event: ${eventType}`);

    const subscription = this.eventSubject.pipe(
      filter(event => event.type === eventType),
      map(event => event as T)
    ).subscribe({
      next: async (event) => {
        try {
          console.log(`📥 Handling event: ${eventType}`, {
            aggregateId: event.aggregateId,
            occurredOn: event.occurredOn
          });

          await handler(event);
          
          console.log(`✅ Event handled successfully: ${eventType}`);
        } catch (error) {
          console.error(`❌ Error handling event ${eventType}:`, error);
        }
      },
      error: (error) => {
        console.error(`❌ Event subscription error for ${eventType}:`, error);
      }
    });

    // Crear función de unsubscribe
    const unsubscribe = () => {
      console.log(`🔕 Unsubscribing from event: ${eventType}`);
      subscription.unsubscribe();
      this.eventSubscriptions.delete(eventType);
    };

    // Guardar referencia para cleanup
    this.eventSubscriptions.set(eventType, unsubscribe);

    return unsubscribe;
  }

  async publishBatch(events: DomainEvent[]): Promise<void> {
    console.log(`📡 Publishing batch of ${events.length} events`);

    // Publicar eventos en secuencia
    for (const event of events) {
      await this.publish(event);
    }

    console.log(`✅ Batch of ${events.length} events published successfully`);
  }

  /**
   * Obtener lista de suscripciones activas
   */
  getActiveSubscriptions(): string[] {
    return Array.from(this.eventSubscriptions.keys());
  }

  /**
   * Limpiar todas las suscripciones
   */
  clearAllSubscriptions(): void {
    console.log('🧹 Clearing all event subscriptions');
    
    this.eventSubscriptions.forEach((unsubscribe) => {
      unsubscribe();
    });
    
    this.eventSubscriptions.clear();
  }

  /**
   * Obtener observable directo para casos avanzados
   */
  getEventStream() {
    return this.eventSubject.asObservable();
  }
}