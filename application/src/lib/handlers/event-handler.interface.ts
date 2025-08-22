import { DomainEvent } from '../ports/event-bus.port';

/**
 * Interfaz base para manejadores de eventos
 */
export interface EventHandler<T extends DomainEvent> {
  /**
   * Maneja un evento específico
   * @param event - Evento a manejar
   */
  handle(event: T): Promise<void>;

  /**
   * Tipo de evento que maneja este handler
   */
  readonly eventType: string;
}