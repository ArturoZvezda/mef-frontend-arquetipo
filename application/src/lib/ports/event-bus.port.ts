/**
 * Eventos del dominio que pueden ser publicados
 */
export interface DomainEvent {
  readonly type: string;
  readonly occurredOn: Date;
  readonly aggregateId: string;
  readonly payload: any;
}

/**
 * Eventos específicos del dominio
 */
export interface UserCreatedEvent extends DomainEvent {
  type: 'USER_CREATED';
  payload: {
    userId: string;
    email: string;
    name: string;
  };
}

export interface ProductReservedEvent extends DomainEvent {
  type: 'PRODUCT_RESERVED';
  payload: {
    productId: string;
    quantity: number;
    userId: string;
  };
}

export interface ProductStockUpdatedEvent extends DomainEvent {
  type: 'PRODUCT_STOCK_UPDATED';
  payload: {
    productId: string;
    oldStock: number;
    newStock: number;
  };
}

export interface UserActivatedEvent extends DomainEvent {
  type: 'USER_ACTIVATED';
  payload: {
    userId: string;
    email: string;
    name: string;
    activatedBy: string;
    activatedAt: Date;
    reason?: string;
  };
}

/**
 * Puerto para sistema de eventos de dominio
 * Permite publicar eventos y suscribirse a ellos
 */
export interface EventBusPort {
  /**
   * Publicar un evento de dominio
   * @param event - Evento a publicar
   */
  publish<T extends DomainEvent>(event: T): Promise<void>;

  /**
   * Suscribirse a eventos de un tipo específico
   * @param eventType - Tipo de evento
   * @param handler - Función que maneja el evento
   * @returns Función para desuscribirse
   */
  subscribe<T extends DomainEvent>(
    eventType: string,
    handler: (event: T) => Promise<void> | void
  ): () => void;

  /**
   * Publicar múltiples eventos en una transacción
   * @param events - Lista de eventos a publicar
   */
  publishBatch(events: DomainEvent[]): Promise<void>;
}