import { Injectable } from '@angular/core';
import { User, Product } from '@mef-frontend-arquetipo/domain';
import { NotificationPort } from '@mef-frontend-arquetipo/application';

/**
 * Implementación de notificaciones para consola (desarrollo)
 * Útil para testing y desarrollo local
 */
@Injectable({
  providedIn: 'root'
})
export class ConsoleNotificationAdapter implements NotificationPort {

  async sendWelcomeEmail(user: User): Promise<void> {
    console.log('📧 WELCOME EMAIL SENT', {
      to: user.getEmail().getValue(),
      subject: 'Welcome to MEF Platform!',
      user: {
        id: user.getId().getValue(),
        name: user.getName(),
        email: user.getEmail().getValue()
      },
      timestamp: new Date().toISOString()
    });

    // Simular delay de envío
    await this.delay(100);
  }

  async sendProductAvailableNotification(user: User, product: Product): Promise<void> {
    console.log('🔔 PRODUCT AVAILABLE NOTIFICATION', {
      to: user.getEmail().getValue(),
      subject: `Product "${product.getName()}" is now available!`,
      user: {
        id: user.getId().getValue(),
        name: user.getName()
      },
      product: {
        id: product.getId().getValue(),
        name: product.getName(),
        stock: product.getStock(),
        price: product.getPrice().toFormattedString()
      },
      timestamp: new Date().toISOString()
    });

    await this.delay(150);
  }

  async sendReservationConfirmation(user: User, product: Product, quantity: number): Promise<void> {
    console.log('✅ RESERVATION CONFIRMATION', {
      to: user.getEmail().getValue(),
      subject: `Reservation confirmed for ${product.getName()}`,
      reservation: {
        user: {
          id: user.getId().getValue(),
          name: user.getName(),
          email: user.getEmail().getValue()
        },
        product: {
          id: product.getId().getValue(),
          name: product.getName(),
          price: product.getPrice().toFormattedString()
        },
        quantity,
        totalPrice: product.getPrice().multiply(quantity).toFormattedString(),
        reservedAt: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    });

    await this.delay(200);
  }

  async sendLowStockAlert(product: Product, currentStock: number, threshold: number): Promise<void> {
    console.log('⚠️ LOW STOCK ALERT', {
      to: 'admin@mef-platform.com', // Email de administradores
      subject: `LOW STOCK ALERT: ${product.getName()}`,
      product: {
        id: product.getId().getValue(),
        name: product.getName(),
        currentStock,
        threshold,
        price: product.getPrice().toFormattedString()
      },
      severity: currentStock === 0 ? 'CRITICAL' : 'WARNING',
      timestamp: new Date().toISOString()
    });

    await this.delay(100);
  }

  async send(recipient: string, subject: string, message: string, type: 'email' | 'sms' | 'push'): Promise<void> {
    console.log(`📬 GENERIC ${type.toUpperCase()} NOTIFICATION`, {
      to: recipient,
      subject,
      message,
      type,
      timestamp: new Date().toISOString()
    });

    await this.delay(100);
  }

  /**
   * Simular delay de red
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}