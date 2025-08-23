import { Injectable, Inject } from '@angular/core';
import { UserCreatedEvent } from '../ports/event-bus.port';
import { EventHandler } from './event-handler.interface';
import { NOTIFICATION_TOKEN, LOGGING_TOKEN } from '../tokens/injection-tokens';
import type { NotificationPort } from '../ports/notification.port';
import type { LoggingPort } from '../ports/logging.port';

/**
 * Manejador de eventos para cuando se crea un usuario
 * Implementa Side Effects que deben ocurrir tras la creación
 */
@Injectable({
  providedIn: 'root'
})
export class UserCreatedHandler implements EventHandler<UserCreatedEvent> {
  readonly eventType = 'USER_CREATED';

  constructor(
    @Inject(NOTIFICATION_TOKEN) private notificationService: NotificationPort,
    @Inject(LOGGING_TOKEN) private logger: LoggingPort
  ) {}

  async handle(event: UserCreatedEvent): Promise<void> {
    const { userId, email, name } = event.payload;

    try {
      this.logger.info(`📧 Procesando evento USER_CREATED para usuario: ${name}`, {
        userId,
        email,
        eventId: event.aggregateId,
        occurredOn: event.occurredOn
      });

      // 1. Enviar email de bienvenida
      await this.sendWelcomeEmail(email, name);

      // 2. Crear perfil por defecto
      await this.createDefaultProfile(userId);

      // 3. Registrar métricas de usuario nuevo
      await this.recordUserMetrics(userId);

      // 4. Notificar administradores si es necesario
      await this.notifyAdministrators(userId, email);

      this.logger.info(`✅ Usuario ${name} procesado completamente`, {
        userId,
        email
      });

    } catch (error) {
      const metadata = {
        userId,
        email
      };
      const errorObj = error instanceof Error ? error : new Error(String(error));
      this.logger.error(`❌ Error procesando usuario creado`, errorObj, metadata);

      // En un escenario real, aquí podríamos:
      // - Enviar el evento a una cola de retry
      // - Notificar al sistema de monitoring
      // - Implementar compensación si es necesario
      throw error;
    }
  }

  private async sendWelcomeEmail(email: string, name: string): Promise<void> {
    await this.notificationService.send({
      type: 'email',
      recipient: email,
      subject: '¡Bienvenido al MEF!',
      content: `Hola ${name}, bienvenido al sistema del Ministerio de Economía y Finanzas.`,
      metadata: {
        template: 'welcome-user',
        priority: 'normal'
      }
    });

    this.logger.info(`📧 Email de bienvenida enviado a ${email}`);
  }

  private async createDefaultProfile(userId: string): Promise<void> {
    // Simular creación de perfil por defecto
    await new Promise(resolve => setTimeout(resolve, 100));
    
    this.logger.info(`👤 Perfil por defecto creado para usuario ${userId}`);
  }

  private async recordUserMetrics(userId: string): Promise<void> {
    // Simular registro de métricas
    await new Promise(resolve => setTimeout(resolve, 50));
    
    this.logger.info(`📊 Métricas registradas para usuario ${userId}`);
  }

  private async notifyAdministrators(userId: string, email: string): Promise<void> {
    // Solo notificar en ciertos casos (ej: dominio específico)
    if (email.includes('@mef.gob.pe')) {
      await this.notificationService.send({
        type: 'system',
        recipient: 'admin@mef.gob.pe',
        subject: 'Nuevo usuario MEF registrado',
        content: `Se ha registrado un nuevo usuario con email institucional: ${email}`,
        metadata: {
          userId,
          userType: 'institutional'
        }
      });

      this.logger.info(`🔔 Administradores notificados sobre usuario institucional ${email}`);
    }
  }
}