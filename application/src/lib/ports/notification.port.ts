import { User, Product } from '@mef-frontend-arquetipo/domain';

/**
 * Estructura de una notificación genérica
 */
export interface NotificationData {
  type: 'email' | 'sms' | 'push' | 'system';
  recipient: string;
  subject: string;
  content: string;
  metadata?: Record<string, any>;
}

/**
 * Puerto para servicio de notificaciones
 * Implementado por adapters que pueden ser email, SMS, push notifications, etc.
 */
export interface NotificationPort {
  /**
   * Enviar email de bienvenida a usuario nuevo
   * @param user - Usuario al que enviar la notificación
   * @returns Promise que se resuelve cuando se envía
   */
  sendWelcomeEmail(user: User): Promise<void>;

  /**
   * Notificar cuando un producto está disponible nuevamente
   * @param user - Usuario a notificar
   * @param product - Producto que está disponible
   * @returns Promise que se resuelve cuando se envía
   */
  sendProductAvailableNotification(user: User, product: Product): Promise<void>;

  /**
   * Enviar notificación de confirmación de reserva
   * @param user - Usuario que hizo la reserva
   * @param product - Producto reservado
   * @param quantity - Cantidad reservada
   * @returns Promise que se resuelve cuando se envía
   */
  sendReservationConfirmation(user: User, product: Product, quantity: number): Promise<void>;

  /**
   * Enviar notificación de stock bajo a administradores
   * @param product - Producto con stock bajo
   * @param currentStock - Stock actual
   * @param threshold - Umbral mínimo de stock
   * @returns Promise que se resuelve cuando se envía
   */
  sendLowStockAlert(product: Product, currentStock: number, threshold: number): Promise<void>;

  /**
   * Enviar notificación genérica (método principal)
   * @param notification - Datos de la notificación
   * @returns Promise que se resuelve cuando se envía
   */
  send(notification: NotificationData): Promise<void>;

  /**
   * Método simple para enviar notificaciones (backward compatibility)
   * @param recipient - Destinatario (email o teléfono)
   * @param subject - Asunto de la notificación
   * @param message - Contenido del mensaje
   * @param type - Tipo de notificación ('email' | 'sms' | 'push')
   * @returns Promise que se resuelve cuando se envía
   */
  sendSimple(recipient: string, subject: string, message: string, type: 'email' | 'sms' | 'push'): Promise<void>;
}