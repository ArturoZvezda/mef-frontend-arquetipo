import { Injectable } from '@angular/core';
import { ProductReservedEvent } from '../ports/event-bus.port';
import { EventHandler } from './event-handler.interface';
import { NotificationPort } from '../ports/notification.port';
import { LoggingPort } from '../ports/logging.port';

/**
 * Manejador de eventos para cuando se reserva stock de producto
 * Implementa Side Effects como notificaciones, auditoría, etc.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductReservedHandler implements EventHandler<ProductReservedEvent> {
  readonly eventType = 'PRODUCT_RESERVED';

  constructor(
    private notificationService: NotificationPort,
    private logger: LoggingPort
  ) {}

  async handle(event: ProductReservedEvent): Promise<void> {
    const { productId, quantity, userId } = event.payload;

    try {
      this.logger.info(`📦 Procesando reserva de producto`, {
        productId,
        quantity,
        userId,
        eventId: event.aggregateId,
        occurredOn: event.occurredOn
      });

      // 1. Actualizar cache de disponibilidad
      await this.updateAvailabilityCache(productId, quantity);

      // 2. Notificar al usuario sobre la reserva
      await this.notifyUserReservation(userId, productId, quantity);

      // 3. Verificar si necesita restock
      await this.checkRestockNeeded(productId);

      // 4. Auditar la operación
      await this.auditReservation(productId, quantity, userId, event.occurredOn);

      // 5. Actualizar métricas de demanda
      await this.updateDemandMetrics(productId, quantity);

      this.logger.info(`✅ Reserva de producto procesada completamente`, {
        productId,
        quantity,
        userId
      });

    } catch (error) {
      this.logger.error(`❌ Error procesando reserva de producto: ${error}`, {
        productId,
        quantity,
        userId,
        error: error instanceof Error ? error.message : String(error)
      });

      // En producción: implementar retry, compensación, etc.
      throw error;
    }
  }

  private async updateAvailabilityCache(productId: string, quantity: number): Promise<void> {
    // Simular actualización de cache
    await new Promise(resolve => setTimeout(resolve, 80));
    
    this.logger.info(`💾 Cache de disponibilidad actualizado para producto ${productId} (-${quantity})`);
  }

  private async notifyUserReservation(userId: string, productId: string, quantity: number): Promise<void> {
    await this.notificationService.send({
      type: 'push',
      recipient: userId,
      subject: 'Reserva confirmada',
      content: `Tu reserva de ${quantity} unidades del producto ${productId} ha sido confirmada.`,
      metadata: {
        productId,
        quantity,
        type: 'reservation-confirmed'
      }
    });

    this.logger.info(`🔔 Usuario ${userId} notificado sobre reserva confirmada`);
  }

  private async checkRestockNeeded(productId: string): Promise<void> {
    // Simular verificación de restock
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Simular que el 20% de las veces necesita restock
    const needsRestock = Math.random() < 0.2;
    
    if (needsRestock) {
      await this.notificationService.send({
        type: 'system',
        recipient: 'inventory@mef.gob.pe',
        subject: 'Restock necesario',
        content: `El producto ${productId} necesita restock urgente.`,
        metadata: {
          productId,
          priority: 'high',
          type: 'restock-alert'
        }
      });

      this.logger.warn(`⚠️ Alerta de restock enviada para producto ${productId}`);
    }
  }

  private async auditReservation(
    productId: string, 
    quantity: number, 
    userId: string, 
    occurredOn: Date
  ): Promise<void> {
    // Simular auditoría
    await new Promise(resolve => setTimeout(resolve, 60));
    
    this.logger.info(`📋 Auditoría registrada: Reserva de ${quantity} unidades`, {
      productId,
      userId,
      timestamp: occurredOn,
      action: 'PRODUCT_RESERVED'
    });
  }

  private async updateDemandMetrics(productId: string, quantity: number): Promise<void> {
    // Simular actualización de métricas de demanda
    await new Promise(resolve => setTimeout(resolve, 40));
    
    this.logger.info(`📈 Métricas de demanda actualizadas para producto ${productId} (+${quantity})`);
  }
}