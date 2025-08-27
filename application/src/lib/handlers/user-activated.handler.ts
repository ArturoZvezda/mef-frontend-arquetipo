import { Injectable, Inject } from '@angular/core';
import { UserActivatedEvent } from '../ports/event-bus.port';
import { EventHandler } from './event-handler.interface';
import { NOTIFICATION_TOKEN, LOGGING_TOKEN } from '../tokens/injection-tokens';
import type { NotificationPort } from '../ports/notification.port';
import type { LoggingPort } from '../ports/logging.port';

/**
 * Manejador de eventos para cuando se activa un usuario
 * Implementa Side Effects que deben ocurrir tras la activación
 */
@Injectable({
  providedIn: 'root'
})
export class UserActivatedHandler implements EventHandler<UserActivatedEvent> {
  readonly eventType = 'USER_ACTIVATED';

  constructor(
    @Inject(NOTIFICATION_TOKEN) private notificationService: NotificationPort,
    @Inject(LOGGING_TOKEN) private logger: LoggingPort
  ) {}

  async handle(event: UserActivatedEvent): Promise<void> {
    const { userId, email, name, activatedBy, reason } = event.payload;

    try {
      this.logger.info(`🎉 Processing USER_ACTIVATED event for: ${name}`, {
        userId,
        activatedBy,
        reason,
        eventId: event.aggregateId,
        occurredOn: event.occurredOn
      });

      // 1. Enviar email de confirmación de activación
      await this.sendActivationConfirmationEmail(email, name);

      // 2. Notificar al usuario que activó (si es admin)
      await this.notifyActivator(activatedBy, name, email);

      // 3. Registrar métricas de activación
      await this.recordActivationMetrics(userId, activatedBy);

      // 4. Actualizar permisos del usuario
      await this.updateUserPermissions(userId);

      this.logger.info(`✅ User activation processed successfully for ${name}`, {
        userId,
        email
      });

    } catch (error) {
      const metadata = {
        userId,
        email
      };
      const errorObj = error instanceof Error ? error : new Error(String(error));
      this.logger.error('❌ Error processing user activation', errorObj, metadata);

      // En un escenario real, aquí podríamos:
      // - Enviar el evento a una cola de retry
      // - Notificar al sistema de monitoring
      // - Implementar compensación si es necesario
      throw error;
    }
  }

  private async sendActivationConfirmationEmail(email: string, name: string): Promise<void> {
    await this.notificationService.send({
      type: 'email',
      recipient: email,
      subject: 'Tu cuenta ha sido activada',
      content: `¡Hola ${name}! Tu cuenta en el sistema MEF ha sido activada exitosamente. Ya puedes acceder a todas las funcionalidades.`,
      metadata: {
        template: 'user-activation-confirmation',
        priority: 'high'
      }
    });

    this.logger.info(`📧 Activation confirmation email sent to ${email}`);
  }

  private async notifyActivator(activatedBy: string, userName: string, userEmail: string): Promise<void> {
    // Simular notificación al admin que activó el usuario
    await new Promise(resolve => setTimeout(resolve, 50));
    this.logger.info(`🔔 Notified ${activatedBy} about activation of ${userName} (${userEmail})`);
  }

  private async recordActivationMetrics(userId: string, activatedBy: string): Promise<void> {
    // Simular registro de métricas de activación
    await new Promise(resolve => setTimeout(resolve, 30));
    this.logger.info(`📊 Activation metrics recorded for user ${userId} by ${activatedBy}`);
  }

  private async updateUserPermissions(userId: string): Promise<void> {
    // Simular actualización de permisos para usuario activado
    await new Promise(resolve => setTimeout(resolve, 100));
    this.logger.info(`🔐 Permissions updated for activated user ${userId}`);
  }
}